import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import Stripe from 'stripe';

// Disable body parsing — Stripe needs raw body for signature verification
// (Node.js runtime is the default for API routes; no explicit export needed)

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
  }

  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as SessionWithShipping;
    await handleCheckoutComplete(session);
  }

  return NextResponse.json({ received: true });
}

// Stripe v22 removed shipping_details from Session type but it exists at runtime
type SessionWithShipping = Stripe.Checkout.Session & {
  shipping_details?: {
    address?: {
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      state?: string | null;
      country?: string | null;
      postal_code?: string | null;
    };
  };
};

async function handleCheckoutComplete(session: SessionWithShipping) {
  try {
    // Dynamic import to avoid loading firebase-admin at edge/build time
    const { getFirebaseAdmin } = await import('@/lib/firebase-admin');
    const { db } = await getFirebaseAdmin();
    const stripe = getStripe();

    const lineItemsResponse = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
    });

    const orderData = {
      stripeSessionId: session.id,
      status: 'paid',
      customer: {
        name: session.customer_details?.name ?? '',
        email: session.customer_details?.email ?? '',
      },
      shippingAddress: session.shipping_details?.address
        ? {
            line1: session.shipping_details.address.line1 ?? '',
            line2: session.shipping_details.address.line2 ?? '',
            city: session.shipping_details.address.city ?? '',
            state: session.shipping_details.address.state ?? '',
            country: session.shipping_details.address.country ?? '',
            postalCode: session.shipping_details.address.postal_code ?? '',
          }
        : null,
      shippingZone: session.metadata?.shippingZone ?? 'US',
      shippingOptionId: session.metadata?.shippingOptionId ?? '',
      lineItems: lineItemsResponse.data.map((li) => ({
        name: li.description ?? '',
        quantity: li.quantity ?? 1,
        amountTotal: li.amount_total,
      })),
      subtotalCents: session.amount_subtotal ?? 0,
      totalCents: session.amount_total ?? 0,
      currency: session.currency ?? 'usd',
      paymentStatus: session.payment_status,
      createdAt: new Date().toISOString(),
      // Guest-order linking — uid populated immediately if account exists, otherwise null
      customerEmail: session.customer_details?.email ?? '',
      uid: null as string | null,
    };

    await db.collection('orders').doc(session.id).set(orderData);
    console.log('Order saved:', session.id);

    // Link order to user account if one exists with this email
    const customerEmail = session.customer_details?.email;
    if (customerEmail) {
      const usersSnap = await db.collection('users').where('email', '==', customerEmail).limit(1).get();
      if (!usersSnap.empty) {
        await db.collection('orders').doc(session.id).update({ uid: usersSnap.docs[0].id });
      }
    }

    // Send confirmation email (if Resend is configured)
    if (process.env.RESEND_API_KEY && session.customer_details?.email) {
      const { sendOrderConfirmationEmail } = await import('@/lib/email');
      await sendOrderConfirmationEmail({
        to: session.customer_details.email,
        customerName: session.customer_details.name ?? 'Valued Customer',
        orderId: session.id,
        items: lineItemsResponse.data.map((li) => ({
          name: li.description ?? '',
          quantity: li.quantity ?? 1,
          priceCents: li.amount_total ?? 0,
        })),
        totalCents: session.amount_total ?? 0,
      });
    }
  } catch (err) {
    console.error('Error processing webhook:', err);
    // Don't throw — we still want to return 200 to Stripe
  }
}
