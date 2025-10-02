
'use client';
import { useState } from 'react';
import { useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';



export const CardForm = () => {
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
        className="w-full rounded-xl px-4 py-3 bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {submitting ? 'Processing…' : 'Pay 199 NOK with Card'}
      </button>
      {message && <p className="text-sm text-red-600">{message}</p>}
    </form>
  );
}

