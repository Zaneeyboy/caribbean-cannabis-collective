import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'Caribbean Cannabis Collective <hello@caribbeancannabiscollective.com>';
const REPLY_TO = 'support@caribbeancannabiscollective.com';

// ─── Shared layout helpers ─────────────────────────────────────────────────

function emailWrapper(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Caribbean Cannabis Collective</title></head>
<body style="background:#0A1A0A;margin:0;padding:0;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#142414;border:1px solid #3D3830;overflow:hidden;max-width:600px;width:100%;">
          <!-- Brand header -->
          <tr>
            <td style="background:#1E3A1E;padding:28px 32px;border-bottom:1px solid #3D3830;">
              <p style="color:#C9A84C;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 4px;">Caribbean Cannabis Collective</p>
              <p style="color:#F4EFE4;font-size:28px;font-family:Georgia,serif;margin:0;font-weight:400;letter-spacing:0.05em;">CCC</p>
            </td>
          </tr>
          <!-- Main body -->
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px 24px;border-top:1px solid #3D3830;text-align:center;">
              <p style="color:#8A8278;font-size:11px;margin:0 0 4px;letter-spacing:0.1em;">© ${new Date().getFullYear()} Caribbean Cannabis Collective · Farmers Helping Farmers</p>
              <p style="color:#3D3830;font-size:10px;margin:0;">
                <a href="https://caribbeancannabiscollective.com/privacy" style="color:#3D3830;">Privacy Policy</a>
                &nbsp;·&nbsp;
                <a href="https://caribbeancannabiscollective.com/terms" style="color:#3D3830;">Terms</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function heading(text: string): string {
  return `<h1 style="color:#F4EFE4;font-size:28px;font-family:Georgia,serif;font-weight:400;margin:0 0 16px;line-height:1.2;">${text}</h1>`;
}

function paragraph(text: string): string {
  return `<p style="color:#8A8278;font-size:14px;line-height:1.7;margin:0 0 16px;">${text}</p>`;
}

function highlight(text: string): string {
  return `<span style="color:#D4CCB8;">${text}</span>`;
}

function button(label: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;padding:12px 28px;background:#6DB33F;color:#0A1A0A;font-size:12px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;margin-top:8px;">${label}</a>`;
}

function divider(): string {
  return `<div style="height:1px;background:#3D3830;margin:24px 0;"></div>`;
}

function metaRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 0;color:#8A8278;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;width:120px;">${label}</td>
    <td style="padding:6px 0;color:#C9A84C;font-size:13px;font-family:monospace;">${value}</td>
  </tr>`;
}

// ─── Order Confirmation ────────────────────────────────────────────────────

interface OrderEmailParams {
  to: string;
  customerName: string;
  orderId: string;
  items: { name: string; quantity: number; priceCents: number }[];
  totalCents: number;
  shippingAddress?: string;
}

export async function sendOrderConfirmationEmail(params: OrderEmailParams) {
  const fmt = (cents: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

  const rows = params.items
    .map(
      (item) => `<tr>
        <td style="padding:8px 0;color:#D4CCB8;font-size:14px;border-bottom:1px solid #3D3830;">${item.name}</td>
        <td style="padding:8px 0;color:#8A8278;font-size:14px;text-align:center;border-bottom:1px solid #3D3830;">×${item.quantity}</td>
        <td style="padding:8px 0;color:#6DB33F;font-size:14px;text-align:right;font-weight:700;border-bottom:1px solid #3D3830;">${fmt(item.priceCents)}</td>
      </tr>`,
    )
    .join('');

  const body = `
    ${heading('Order Confirmed')}
    ${paragraph(`Hey ${highlight(params.customerName)}, your order is confirmed! We'll get it on its way and send you a tracking link as soon as it ships.`)}
    ${divider()}
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:4px;">
      ${metaRow('Order ID', params.orderId)}
      ${params.shippingAddress ? metaRow('Ships to', params.shippingAddress) : ''}
    </table>
    ${divider()}
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <thead>
        <tr>
          <th style="text-align:left;color:#8A8278;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;padding-bottom:8px;border-bottom:1px solid #3D3830;">Item</th>
          <th style="text-align:center;color:#8A8278;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;padding-bottom:8px;border-bottom:1px solid #3D3830;">Qty</th>
          <th style="text-align:right;color:#8A8278;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;padding-bottom:8px;border-bottom:1px solid #3D3830;">Price</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding-top:12px;color:#8A8278;font-size:13px;">Total</td>
          <td style="padding-top:12px;color:#6DB33F;font-size:18px;font-weight:700;text-align:right;">${fmt(params.totalCents)}</td>
        </tr>
      </tfoot>
    </table>
    ${divider()}
    ${button('View Your Order', `https://caribbeancannabiscollective.com/order/${params.orderId}`)}
    ${paragraph('Questions? Reply to this email or reach us at <a href="mailto:support@caribbeancannabiscollective.com" style="color:#6DB33F;">support@caribbeancannabiscollective.com</a>')}
  `;

  return resend.emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to: params.to,
    subject: `Order confirmed — #${params.orderId}`,
    html: emailWrapper(body),
  });
}

// ─── Welcome / Sign Up ────────────────────────────────────────────────────

interface WelcomeEmailParams {
  to: string;
  customerName: string;
}

export async function sendWelcomeEmail(params: WelcomeEmailParams) {
  const body = `
    ${heading('Welcome to the Collective.')}
    ${paragraph(`Hey ${highlight(params.customerName)}, you're officially part of the Caribbean Cannabis Collective. Farmers helping farmers — rooted in culture, grown with purpose.`)}
    ${divider()}
    ${paragraph('Here\'s what\'s next:')}
    <ul style="color:#8A8278;font-size:14px;line-height:2;padding-left:20px;margin:0 0 16px;">
      <li>Browse the latest drops in our shop</li>
      <li>Follow us on Instagram &amp; TikTok for behind-the-scenes content</li>
      <li>Expect updates on new products and island events in your inbox</li>
    </ul>
    ${divider()}
    ${button('Shop the Collection', 'https://caribbeancannabiscollective.com/shop')}
  `;

  return resend.emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to: params.to,
    subject: 'Welcome to Caribbean Cannabis Collective',
    html: emailWrapper(body),
  });
}

// ─── Password Reset ───────────────────────────────────────────────────────

interface PasswordResetEmailParams {
  to: string;
  customerName: string;
  resetLink: string;
}

export async function sendPasswordResetEmail(params: PasswordResetEmailParams) {
  const body = `
    ${heading('Reset your password.')}
    ${paragraph(`Hey ${highlight(params.customerName)}, we received a request to reset the password on your CCC account.`)}
    ${paragraph('Click the button below to set a new password. This link expires in <strong style="color:#D4CCB8;">1 hour</strong>.')}
    ${divider()}
    ${button('Reset Password', params.resetLink)}
    ${divider()}
    ${paragraph('If you didn\'t request a password reset, you can safely ignore this email — your account has not been changed.')}
  `;

  return resend.emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to: params.to,
    subject: 'Reset your CCC password',
    html: emailWrapper(body),
  });
}

// ─── Password Changed Confirmation ────────────────────────────────────────

interface PasswordChangedEmailParams {
  to: string;
  customerName: string;
}

export async function sendPasswordChangedEmail(params: PasswordChangedEmailParams) {
  const body = `
    ${heading('Password updated.')}
    ${paragraph(`Hey ${highlight(params.customerName)}, your Caribbean Cannabis Collective password was successfully changed.`)}
    ${paragraph('If you made this change, no further action is needed.')}
    ${divider()}
    ${paragraph('If you did <strong style="color:#D4CCB8;">not</strong> make this change, please contact us immediately at <a href="mailto:support@caribbeancannabiscollective.com" style="color:#6DB33F;">support@caribbeancannabiscollective.com</a> so we can secure your account.')}
  `;

  return resend.emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to: params.to,
    subject: 'Your CCC password was changed',
    html: emailWrapper(body),
  });
}

// ─── Order Shipped ────────────────────────────────────────────────────────

interface OrderShippedEmailParams {
  to: string;
  customerName: string;
  orderId: string;
  trackingNumber?: string;
  carrier?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
}

export async function sendOrderShippedEmail(params: OrderShippedEmailParams) {
  const body = `
    ${heading('Your order is on its way.')}
    ${paragraph(`Hey ${highlight(params.customerName)}, your CCC order has shipped! It's making its way to you now.`)}
    ${divider()}
    <table width="100%" cellpadding="0" cellspacing="0">
      ${metaRow('Order ID', params.orderId)}
      ${params.carrier ? metaRow('Carrier', params.carrier) : ''}
      ${params.trackingNumber ? metaRow('Tracking #', params.trackingNumber) : ''}
      ${params.estimatedDelivery ? metaRow('Est. Arrival', params.estimatedDelivery) : ''}
    </table>
    ${divider()}
    ${params.trackingUrl ? button('Track Your Shipment', params.trackingUrl) : ''}
    ${paragraph('Questions? Reply to this email or contact us at <a href="mailto:support@caribbeancannabiscollective.com" style="color:#6DB33F;">support@caribbeancannabiscollective.com</a>')}
  `;

  return resend.emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to: params.to,
    subject: `Your CCC order has shipped — #${params.orderId}`,
    html: emailWrapper(body),
  });
}

// ─── Newsletter Welcome ───────────────────────────────────────────────────

interface NewsletterWelcomeParams {
  to: string;
}

export async function sendNewsletterWelcomeEmail(params: NewsletterWelcomeParams) {
  const body = `
    ${heading('You\'re on the list.')}
    ${paragraph('Thanks for joining the CCC mailing list. You\'ll be the first to hear about new drops, island events, and stories from the farmers we work with.')}
    ${divider()}
    ${button('Explore the Shop', 'https://caribbeancannabiscollective.com/shop')}
    ${paragraph('<a href="https://caribbeancannabiscollective.com/unsubscribe" style="color:#3D3830;font-size:12px;">Unsubscribe at any time</a>')}
  `;

  return resend.emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to: params.to,
    subject: 'You\'re in — Caribbean Cannabis Collective',
    html: emailWrapper(body),
  });
}