import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Caribbean Cannabis Collective',
  description: 'Privacy Policy for the Caribbean Cannabis Collective online store.',
};

const LAST_UPDATED = 'May 12, 2026';

export default function PrivacyPage() {
  return (
    <div className='min-h-screen bg-forest'>
      <section className='bg-canopy border-b border-smoke py-14 md:py-20 px-4 relative'>
        <div className='max-w-3xl mx-auto'>
          <p className='text-xs font-bold tracking-[0.3em] uppercase text-gold mb-3'>Legal</p>
          <h1 className='font-display text-5xl md:text-6xl text-cream mb-2'>Privacy Policy</h1>
          <p className='text-mist text-sm'>Last updated: {LAST_UPDATED}</p>
        </div>
        <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent' />
      </section>

      <div className='max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16 prose prose-invert prose-sm max-w-none'>
        <div className='space-y-8 text-mist text-sm leading-relaxed'>
          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>1. Information We Collect</h2>
            <p>When you visit or make a purchase from the Caribbean Cannabis Collective store, we collect the following types of information:</p>
            <ul className='list-disc pl-5 mt-2 space-y-1'>
              <li>
                <strong className='text-ivory'>Account information:</strong> Name, email address, and password when you create an account.
              </li>
              <li>
                <strong className='text-ivory'>Order information:</strong> Name, shipping address, email, and order details when you place an order.
              </li>
              <li>
                <strong className='text-ivory'>Payment information:</strong> Payment is processed by Stripe. We do not store your card number or CVV on our servers.
              </li>
              <li>
                <strong className='text-ivory'>Usage data:</strong> Pages visited, browser type, device type, and IP address collected automatically via standard web server logs.
              </li>
            </ul>
          </section>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className='list-disc pl-5 mt-2 space-y-1'>
              <li>Process and fulfill your orders</li>
              <li>Send order confirmation and shipping notification emails</li>
              <li>Respond to customer service inquiries</li>
              <li>Improve our website and products</li>
              <li>Send promotional emails (only with your consent — you can unsubscribe at any time)</li>
            </ul>
          </section>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>3. Information Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
            <ul className='list-disc pl-5 mt-2 space-y-1'>
              <li>
                <strong className='text-ivory'>Stripe:</strong> For secure payment processing.
              </li>
              <li>
                <strong className='text-ivory'>Shipping carriers:</strong> Name and address shared with FedEx, USPS, DHL, or local Caribbean carriers to deliver your order.
              </li>
              <li>
                <strong className='text-ivory'>Resend:</strong> For transactional email delivery (order confirmations, shipping notifications).
              </li>
              <li>
                <strong className='text-ivory'>Law enforcement:</strong> If required by applicable law or to protect the safety of our customers or staff.
              </li>
            </ul>
          </section>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>4. Cookies</h2>
            <p>Our site uses cookies and similar technologies to:</p>
            <ul className='list-disc pl-5 mt-2 space-y-1'>
              <li>Keep you signed in to your account</li>
              <li>Remember your shopping cart between sessions</li>
              <li>Understand how visitors use our site (analytics)</li>
            </ul>
            <p className='mt-2'>You can disable cookies in your browser settings, but some features of the site may not work correctly.</p>
          </section>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>5. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active or as needed to provide services. Order records are retained for 7 years for tax and legal compliance. You may request
              deletion of your account and personal data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>6. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className='list-disc pl-5 mt-2 space-y-1'>
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications</li>
              <li>Data portability</li>
            </ul>
            <p className='mt-2'>
              To exercise any of these rights, contact us at{' '}
              <a href='mailto:privacy@caribbeancannabiscollective.com' className='text-lime hover:underline'>
                privacy@caribbeancannabiscollective.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>7. Security</h2>
            <p>
              We implement industry-standard security measures including HTTPS encryption, secure Firebase authentication, and Stripe PCI-DSS compliance. No method of transmission over the internet is
              100% secure — we cannot guarantee absolute security but take reasonable precautions.
            </p>
          </section>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>8. Children&apos;s Privacy</h2>
            <p>
              Our site is not directed to children under 18. We do not knowingly collect personal information from minors. If you believe a minor has provided us with personal information, contact us
              and we will delete it.
            </p>
          </section>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date. Continued use of our site after changes
              constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className='font-heading text-cream text-xl font-semibold mb-3'>10. Contact</h2>
            <p>For privacy-related questions, contact us at:</p>
            <address className='not-italic mt-2'>
              <p className='text-ivory'>Caribbean Cannabis Collective</p>
              <p>
                <a href='mailto:privacy@caribbeancannabiscollective.com' className='text-lime hover:underline'>
                  privacy@caribbeancannabiscollective.com
                </a>
              </p>
            </address>
          </section>
        </div>
      </div>
    </div>
  );
}
