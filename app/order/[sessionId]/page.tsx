import { Suspense } from 'react';
import { getStripe } from '@/lib/stripe';
import { connection } from 'next/server';
import OrderContent from './_content';

export default async function OrderConfirmationPage({ params }: { params: Promise<{ sessionId: string }> }) {
  // connection() tells Next.js this page is always dynamically rendered,
  // which allows Date.now() / timers in downstream code (e.g. Stripe SDK).
  await connection();
  const { sessionId } = await params;

  let customerEmail: string | null = null;
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    customerEmail = session.customer_details?.email ?? null;
  } catch {
    // Proceed without email — sign-up prompt will show empty email field
  }

  return (
    <Suspense fallback={<div className='min-h-screen bg-forest' />}>
      <OrderContent sessionId={sessionId} customerEmail={customerEmail} />
    </Suspense>
  );
}
