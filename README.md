# Vipps Payment Integration with Next.js and Stripe

A Next.js application demonstrating Vipps payment integration using Stripe's Payment Element with support for Vipps, credit cards, and PayPal.

## � Quick Setup

1. **Clone and install:**

```bash
git clone <your-repo-url>
cd vipps_04
npm install
```

2. **Create environment file:**
   Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

3. **Run the application:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to test payments.

## � Prerequisites

- Node.js 18.17+
- Stripe account with Vipps beta access
- Your Stripe API keys

## 🔑 Vipps Configuration

This project uses Stripe's Vipps beta feature:

````typescript
// Stripe client with Vipps beta API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil;vipps_preview=v1",
});



## �️ Build & Deploy

```bash
npm run build    # Build for production
npm start        # Start production server
````

## 📝 Notes

- Requires Stripe Vipps beta access
- Payment amounts are in Norwegian øre (1 NOK = 100 øre)
- Built with Next.js 15, React 19, TypeScript, and Tailwind CSS
