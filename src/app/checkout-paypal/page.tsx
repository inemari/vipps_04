// app/checkout-paypal/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PayPalCheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/complete`,
      },
    });

    // If we get here, it's likely a validation/instant error (no redirect happened).
    if (error) setMessage(error.message || 'Something went wrong.');
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="w-full rounded-xl px-4 py-3 bg-yellow-500 text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium hover:bg-yellow-600"
      >
        {submitting ? 'Processing…' : 'Pay 199 NOK with PayPal'}
      </button>
      {message && <p className="text-sm text-red-600">{message}</p>}
    </form>
  );
}

export default function PayPalCheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/create-intent', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: 'paypal' })
      });
      if (res.ok) {
        const { clientSecret } = await res.json();
        setClientSecret(clientSecret);
      }
    })();
  }, []);

  if (!clientSecret) return <div className="p-8">Loading PayPal checkout…</div>;

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl mb-6 font-semibold">PayPal Payment</h1>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: { theme: 'stripe' },
        }}
      >
        <PayPalCheckoutForm />
      </Elements>
    </div>
  );
}