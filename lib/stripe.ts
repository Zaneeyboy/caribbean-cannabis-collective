import Stripe from 'stripe';

// Lazy singleton — only initialised when first called (not at build time)
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('Missing STRIPE_SECRET_KEY environment variable');
  _stripe = new Stripe(key, { apiVersion: '2026-04-22.dahlia' });
  return _stripe;
}
