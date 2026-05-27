# Deployment Guide — Caribbean Cannabis Collective

## Overview

- **Hosting**: Vercel (Preview → Production)
- **Final Domain**: `caribbeancannabiscollective.com` (GoDaddy)
- **CI/CD**: Git push to `main` → auto-deploys to Vercel

---

## Step 1: GitHub Repository

1. Create repo: `Zaneeyboy/caribbean-cannabis-collective` (or client's org)
2. Push initial code:
   ```bash
   git remote add origin https://github.com/Zaneeyboy/caribbean-cannabis-collective.git
   git push -u origin main
   ```

---

## Step 2: Vercel Project Setup

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import the GitHub repository
3. Framework: **Next.js** (auto-detected)
4. Build command: `npm run build` (default)
5. Output directory: `.next` (default)
6. Install command: `npm install` (default)

### Environment Variables in Vercel Dashboard

Add all variables from `.env.local`:

```
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY
RESEND_API_KEY
RESEND_FROM_EMAIL
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
NEXT_PUBLIC_SITE_URL
```

> **Important**: Set `NEXT_PUBLIC_SITE_URL` to the Vercel preview URL initially, then update to the GoDaddy domain on go-live.

---

## Step 3: Stripe Webhook Configuration

1. In Stripe Dashboard → **Developers → Webhooks → Add Endpoint**
2. Endpoint URL: `https://[your-vercel-url]/api/webhooks/stripe`
3. Events to listen for: `checkout.session.completed`
4. Copy the **Signing Secret** → set as `STRIPE_WEBHOOK_SECRET` in Vercel

---

## Step 4: Firebase Setup

1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firestore Database** (production mode)
3. Firestore Rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Orders: server-write only (admin SDK), public read by order ID
       match /orders/{orderId} {
         allow read: if true;   // tighten later with auth
         allow write: if false; // only Firebase Admin (server-side)
       }
     }
   }
   ```
4. Generate **Service Account** → download JSON → extract keys for `FIREBASE_ADMIN_*` env vars

---

## Step 5: GoDaddy Domain Cutover (Go-Live)

> Only do this when the site is fully tested and ready.

### In Vercel:

1. Project Settings → **Domains**
2. Add `caribbeancannabiscollective.com`
3. Also add `www.caribbeancannabiscollective.com`
4. Vercel will provide NS records or A/CNAME records

### In GoDaddy DNS:

**Option A — Nameserver delegation (recommended):**

```
Replace GoDaddy NS records with Vercel's nameservers:
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Option B — CNAME/A record (if keeping GoDaddy DNS):**

```
A Record:    @    →   76.76.21.21   (Vercel IP)
CNAME:       www  →   cname.vercel-dns.com
```

> DNS propagation: 15 minutes to 48 hours. Use [dnschecker.org](https://dnschecker.org) to monitor.

---

## Vercel Configuration File

```json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

---

## Branch Strategy

```
main          → Production (caribbeancannabiscollective.com)
develop       → Preview deployments (*.vercel.app)
feature/*     → Per-feature branches, auto-preview on PR
```

---

## Checklist Before Go-Live

- [ ] All env vars set in Vercel production environment
- [ ] Stripe keys switched from **test** to **live** mode
- [ ] Stripe webhook re-registered with production URL
- [ ] Firebase Firestore rules tightened
- [ ] GoDaddy DNS updated
- [ ] Custom domain verified in Vercel (SSL issued)
- [ ] `NEXT_PUBLIC_SITE_URL` updated to `https://caribbeancannabiscollective.com`
- [ ] Test purchase end-to-end on production
- [ ] Confirm order confirmation email received
