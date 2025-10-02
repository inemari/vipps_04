// app/checkout/page.tsx
'use client';

import { useState } from 'react';

type PaymentMethod = 'vipps' | 'card' | 'paypal';

export default function CheckoutPage() {
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
      // Redirect to PayPal checkout page
      window.location.href = '/checkout-paypal';
    } else {
      // Redirect to card checkout page
      window.location.href = '/checkout-card';
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl mb-6 font-semibold">Choose Payment Method</h1>
      
      <div className="space-y-4 mb-6">
        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="vipps"
              checked={selectedMethod === 'vipps'}
              onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
              className="text-blue-600 w-4 h-4"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">V</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Vipps</div>
                  <div className="text-sm text-gray-600">Pay with your Vipps app</div>
                </div>
              </div>
            </div>
          </label>

          <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={selectedMethod === 'paypal'}
              onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
              className="text-yellow-500 w-4 h-4"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">PP</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">PayPal</div>
                  <div className="text-sm text-gray-600">Pay with your PayPal account</div>
                </div>
              </div>
            </div>
          </label>

          <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={selectedMethod === 'card'}
              onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
              className="text-green-600 w-4 h-4"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">💳</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Credit/Debit Card</div>
                  <div className="text-sm text-gray-600">Pay with Visa, Mastercard, etc.</div>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full rounded-xl px-4 py-3 text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium ${
          selectedMethod === 'vipps' ? 'bg-blue-600 hover:bg-blue-700' : 
          selectedMethod === 'paypal' ? 'bg-yellow-500 hover:bg-yellow-600' : 
          'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? 'Processing...' : `Pay 199 NOK with ${
          selectedMethod === 'vipps' ? 'Vipps' : 
          selectedMethod === 'paypal' ? 'PayPal' : 
          'Card'
        }`}
      </button>

    </div>  
  );
}