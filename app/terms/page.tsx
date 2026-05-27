import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — Caribbean Cannabis Collective',
  description: 'Terms of Service for the Caribbean Cannabis Collective online store.',
};

const LAST_UPDATED = 'May 12, 2026';

export default function TermsPage() {
  return (
    <div className='min-h-screen bg-forest'>
      <section className='bg-canopy border-b border-smoke py-14 md:py-20 px-4 relative'>
        <div className='max-w-3xl mx-auto'>
          <p className='text-xs font-bold tracking-[0.3em] uppercase text-gold mb-3'>Legal</p>
          <h1 className='font-display text-5xl md:text-6xl text-cream mb-2'>Terms of Service</h1>
          <p className='text-mist text-sm'>Last updated: {LAST_UPDATED}</p>
        </div>
        <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent' />
      </section>

      <div className='max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16'>
        <div className='space-y-8 text-mist text-sm leading-relaxed'>
          <p>
            By accessing or making a purchase from <strong className='text-ivory'>caribbeancannabiscollective.com</strong> (the &ldquo;Site&rdquo;), you agree to these Terms of Service. Please read
            them carefully. If you do not agree, do not use the Site.
          </p>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>1. Products &amp; Merchandise</h2>
            <p>
              Caribbean Cannabis Collective sells cannabis-culture lifestyle merchandise — apparel, accessories, and related goods.{' '}
              <strong className='text-ivory'>We do not sell, distribute, or ship cannabis, CBD, THC, or any controlled substance.</strong> All products are legal in the jurisdictions where we operate.
            </p>
          </section>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>2. Age Requirement</h2>
            <p>You must be at least 18 years of age to purchase from this Site. By placing an order, you confirm that you meet this requirement.</p>
          </section>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>3. Orders &amp; Pricing</h2>
            <ul className='list-disc pl-5 space-y-1'>
              <li>All prices are listed in USD.</li>
              <li>We reserve the right to correct pricing errors, cancel orders placed at incorrect prices, and refuse service to any customer at our discretion.</li>
              <li>An order confirmation email does not constitute acceptance of your order. Acceptance occurs when your order ships.</li>
              <li>We reserve the right to limit order quantities.</li>
            </ul>
          </section>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>4. Payment</h2>
            <p>
              Payments are processed securely through Stripe. By providing payment information, you authorize us to charge the total amount due at checkout. All transactions are subject to
              Stripe&apos;s{' '}
              <a href='https://stripe.com/legal/end-users' className='text-lime hover:underline' target='_blank' rel='noopener noreferrer'>
                Terms of Service
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>5. Shipping &amp; Delivery</h2>
            <p>
              Shipping timelines are estimates only and are not guaranteed. We are not liable for delays caused by carriers, customs authorities, or circumstances beyond our control. See our{' '}
              <Link href='/shipping' className='text-lime hover:underline'>
                Shipping page
              </Link>{' '}
              for full details.
            </p>
          </section>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>6. Returns &amp; Refunds</h2>
            <p>
              Unused, unwashed merchandise in original condition may be returned within 30 days of delivery. Sale items and personalized or limited-edition products are final sale. To initiate a
              return, contact us at{' '}
              <a href='mailto:hello@caribbeancannabiscollective.com' className='text-lime hover:underline'>
                hello@caribbeancannabiscollective.com
              </a>
              .
            </p>
            <p className='mt-2'>Refunds are issued to the original payment method within 10 business days of receiving the returned item.</p>
          </section>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>7. Intellectual Property</h2>
            <p>
              All content on this Site — including logos, graphics, photographs, text, and product designs — is the property of Caribbean Cannabis Collective or its licensors and is protected by
              copyright and trademark law. You may not reproduce, distribute, or create derivative works without express written permission.
            </p>
          </section>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>8. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className='list-disc pl-5 mt-2 space-y-1'>
              <li>Use the Site for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Site or its infrastructure</li>
              <li>Use automated tools to scrape, copy, or collect data from the Site without permission</li>
              <li>Impersonate any person or entity, or misrepresent your affiliation</li>
            </ul>
          </section>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>9. Disclaimer of Warranties</h2>
            <p>
              The Site and its content are provided &ldquo;as is&rdquo; without warranties of any kind, express or implied. We do not warrant that the Site will be uninterrupted, error-free, or free
              of viruses or other harmful components.
            </p>
          </section>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Caribbean Cannabis Collective shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the
              Site or purchase of products. Our total liability for any claim shall not exceed the amount paid by you for the specific order in question.
            </p>
          </section>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>11. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of New York, United States, without regard to conflict of law principles. Any disputes arising from these Terms shall be resolved in the
              courts of New York County, NY.
            </p>
          </section>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>12. Changes to These Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date. Continued use of the Site after changes
              constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>13. Contact</h2>
            <p>For questions about these Terms, contact us at:</p>
            <address className='not-italic mt-2'>
              <p className='text-ivory'>Caribbean Cannabis Collective</p>
              <p>
                <a href='mailto:legal@caribbeancannabiscollective.com' className='text-lime hover:underline'>
                  legal@caribbeancannabiscollective.com
                </a>
              </p>
            </address>
          </section>
        </div>
      </div>
    </div>
  );
}
