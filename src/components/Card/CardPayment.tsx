
'use client';
import { useEffect, useState } from "react";
import {  Elements } from '@stripe/react-stripe-js';
import { CardForm } from "./CardForm";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const CardPayment = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/create-intent', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: 'card' })
      });
      if (res.ok) {
        const { clientSecret } = await res.json();
        setClientSecret(clientSecret);
      }
    })();
  }, []);

  if (!clientSecret) return <div className="p-8">Loading checkout…</div>;

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl mb-6 font-semibold">Card Payment</h1>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: { theme: 'stripe' },
        }}
      >
        <CardForm />
      </Elements>
    </div>
  );
}