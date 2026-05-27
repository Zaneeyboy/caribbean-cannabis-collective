import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { SHIPPING_ZONES, getShippingCost } from '@/lib/shipping';
import { type CartItem } from '@/store/cartStore';
import { getFirebaseAdmin } from '@/lib/firebase-admin';

interface CheckoutBody {
  items: CartItem[];
  shippingZone: 'US' | 'CARIBBEAN' | 'CANADA' | 'WORLDWIDE';
  shippingOptionId: string;
}

type FirestoreVariant = { id: string; inventory: number; priceCents?: number };
type FirestoreProduct = { active: boolean; priceCents: number; name: string; variants: FirestoreVariant[] };

export async function POST(req: NextRequest) {
  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { items, shippingZone, shippingOptionId } = body;

  if (!items?.length) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  if (!['US', 'CARIBBEAN', 'CANADA', 'WORLDWIDE'].includes(shippingZone)) {
    return NextResponse.json({ error: 'Invalid shipping zone' }, { status: 400 });
  }

  const zoneConfig = SHIPPING_ZONES[shippingZone];
  const shippingOption = zoneConfig.options.find((o) => o.id === shippingOptionId);
  if (!shippingOption) {
    return NextResponse.json({ error: 'Invalid shipping option' }, { status: 400 });
  }

  // ── Server-side price & inventory verification ────────────────────────────
  // Fetch each product from Firestore to get authoritative prices and stock.
  // This prevents client-side price manipulation and catches sold-out items.
  const { db } = await getFirebaseAdmin();
  const productIds = [...new Set(items.map((i) => i.productId))];
  const productSnaps = await Promise.all(productIds.map((id) => db.collection('products').doc(id).get()));

  const productMap = new Map<string, FirestoreProduct>();
  productSnaps.forEach((snap) => {
    if (snap.exists) productMap.set(snap.id, snap.data() as FirestoreProduct);
  });

  // Validate every line item: product must exist, be active, have stock, and resolve a price
  type VerifiedItem = { item: CartItem; serverPriceCents: number };
  const verifiedItems: VerifiedItem[] = [];

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product || product.active === false) {
      return NextResponse.json({ error: `Product not available: ${item.name}` }, { status: 422 });
    }
    const variant = product.variants?.find((v) => v.id === item.variantId);
    if (!variant) {
      return NextResponse.json({ error: `Variant not found for: ${item.name}` }, { status: 422 });
    }
    if (variant.inventory <= 0) {
      return NextResponse.json({ error: `${item.name} is sold out` }, { status: 422 });
    }
    // Use server-side price (variant-level price takes precedence over product-level)
    const serverPriceCents = variant.priceCents ?? product.priceCents;
    verifiedItems.push({ item, serverPriceCents });
  }
  // ──────────────────────────────────────────────────────────────────────────

  const subtotalCents = verifiedItems.reduce((sum, { item, serverPriceCents }) => sum + serverPriceCents * item.quantity, 0);
  const shippingCents = getShippingCost(shippingZone, shippingOptionId, subtotalCents);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const stripe = getStripe();

  // Build Stripe line items using server-authoritative prices
  const lineItems = verifiedItems.map(({ item, serverPriceCents }) => ({
    quantity: item.quantity,
    price_data: {
      currency: 'usd',
      unit_amount: serverPriceCents,
      product_data: {
        name: item.name,
        images: [item.image].filter((img) => img.startsWith('https://')),
        description: [item.size, item.color].filter(Boolean).join(' · ') || undefined,
      },
    },
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: shippingOption.label,
            fixed_amount: {
              amount: shippingCents,
              currency: 'usd',
            },
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 14 },
            },
          },
        },
      ],
      shipping_address_collection: {
        allowed_countries:
          shippingZone === 'US'
            ? ['US']
            : shippingZone === 'CANADA'
              ? ['CA']
              : shippingZone === 'CARIBBEAN'
                ? ['AG', 'BB', 'BZ', 'DM', 'GD', 'GY', 'JM', 'KN', 'LC', 'SR', 'TT', 'VC', 'AW', 'CW']
                : // WORLDWIDE — broad international list (excludes sanctioned countries)
                  [
                    'AU',
                    'AT',
                    'BE',
                    'BR',
                    'BG',
                    'CL',
                    'CO',
                    'HR',
                    'CY',
                    'CZ',
                    'DK',
                    'EE',
                    'FI',
                    'FR',
                    'DE',
                    'GH',
                    'GI',
                    'GR',
                    'HK',
                    'HU',
                    'IS',
                    'IN',
                    'ID',
                    'IE',
                    'IL',
                    'IT',
                    'JP',
                    'KE',
                    'LV',
                    'LI',
                    'LT',
                    'LU',
                    'MY',
                    'MT',
                    'MX',
                    'NL',
                    'NZ',
                    'NG',
                    'NO',
                    'PH',
                    'PL',
                    'PT',
                    'RO',
                    'SG',
                    'SK',
                    'SI',
                    'ZA',
                    'ES',
                    'SE',
                    'CH',
                    'TH',
                    'AE',
                    'GB',
                    'UY',
                  ],
      },
      success_url: `${siteUrl}/order/{CHECKOUT_SESSION_ID}?success=true`,
      cancel_url: `${siteUrl}/cart`,
      metadata: {
        shippingZone,
        shippingOptionId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
