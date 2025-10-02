// app/checkout/page.tsx
'use client';
import Image from 'next/image';
import { useState } from 'react';


type PaymentMethod = 'vipps' | 'card' | 'paypal';

const paymentOptions: {
  value: PaymentMethod;
  label: string;
  color: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    value: 'vipps',
    label: 'Vipps',
    color: 'bg-vippsOrange',
    icon: <Image src="/vipps-logo.svg" alt="Vipps Logo" className='
    object-cover' width={24} height={24} />,
    description: 'Pay with your Vipps app',
  },
  {
    value: 'paypal',
    label: 'PayPal',
    color: 'bg-yellow-500',
    icon: <span className="text-white font-bold">PP</span>,
    description: 'Pay with your PayPal account',
  },
  {
    value: 'card',
    label: 'Credit/Debit Card',
    color: 'bg-green-600',
    icon: <span className="text-white font-bold">💳</span>,
    description: 'Pay with Visa, Mastercard, etc.',
  },
];
const PaymentMethods = () => {
     const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('vipps');
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);

  const handleVippsPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create PaymentIntent for Vipps
      const createResponse = await fetch('/api/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: 'vipps' }),
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId } = await createResponse.json();

      // Step 2: Confirm PaymentIntent for Vipps (triggers redirect)
      const confirmResponse = await fetch('/api/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paymentIntentId,
          returnUrl: `${window.location.origin}/complete?payment_intent=${paymentIntentId}&payment_intent_client_secret=${clientSecret}`
        }),
      });

      if (!confirmResponse.ok) {
        throw new Error('Failed to confirm payment');
      }

      const { status, nextAction } = await confirmResponse.json();

      // Step 3: Handle redirect for Vipps
      if (status === 'requires_action' && nextAction?.redirect_to_url) {
        // Redirect to Vipps for authorization
        window.location.href = nextAction.redirect_to_url.url;
        return;
      }

    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (selectedMethod === 'vipps') {
      handleVippsPayment();
    } else if (selectedMethod === 'paypal') {
      window.location.href = '/checkout-paypal';
    } else {
      window.location.href = '/checkout-card';
    }
  };
    return (   <> <form
        className="space-y-4 mb-6"
        onSubmit={e => { e.preventDefault(); handlePayment(); }}
        aria-label="Payment method selection"
      >
        {paymentOptions.map(option => (
          <label
            key={option.value}
            className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${selectedMethod === option.value ? 'border-black' : 'border-gray-200'}`}
            htmlFor={option.value}
          >
            <input
              type="radio"
              id={option.value}
              name="paymentMethod"
              value={option.value}
              checked={selectedMethod === option.value}
              onChange={() => setSelectedMethod(option.value)}
              className="w-4 h-4 accent-current"
              aria-checked={selectedMethod === option.value}
            />
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${option.color} rounded-lg flex items-center justify-center`}>
                  {option.icon}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </div>
            </div>
          </label>
        ))}
        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-xl px-4 py-3 text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium ${
            selectedMethod === 'vipps' ? 'bg-vippsOrange text-vippsWhite' :
            selectedMethod === 'paypal' ? 'bg-yellow-500 hover:bg-yellow-600' :
            'bg-green-600 hover:bg-green-700'
          }`}
          aria-busy={loading}
        >
          {loading ? 'Processing...' : `Pay 199 NOK with ${paymentOptions.find(o => o.value === selectedMethod)?.label}`}
        </button>
      </form>
            {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center" role="alert">
          <p className="text-red-600 text-sm font-semibold">{error}</p>
        </div>
      )}</>);
};
export default PaymentMethods;