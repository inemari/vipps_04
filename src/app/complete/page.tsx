// app/order/complete/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CompletePage() {
  const [status, setStatus] = useState<'processing' | 'succeeded' | 'requires_payment_method' | 'unknown'>('unknown');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    (async () => {
      const stripe = await stripePromise;
      if (!stripe) return;
      
      const urlParams = new URLSearchParams(window.location.search);
      const clientSecret = urlParams.get('payment_intent_client_secret');
      const paymentIntentId = urlParams.get('payment_intent');

      // Handle payment return (works for both Vipps and Card)
      if (clientSecret || (paymentIntentId && clientSecret)) {
        try {
          const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
          if (paymentIntent) {
            setStatus(paymentIntent.status as any);
            
            // Detect payment method type
            const isVipps = paymentIntent.payment_method_types?.includes('vipps');
            const paymentMethodName = isVipps ? 'Vipps' : 'Card';
            
            switch (paymentIntent.status) {
              case 'succeeded':
                setMessage(`${paymentMethodName} payment succeeded! 🎉`);
                break;
              case 'processing':
                setMessage(`${paymentMethodName} payment processing…`);
                break;
              case 'requires_payment_method':
                setMessage(`${paymentMethodName} payment failed. ${isVipps ? 'The payment was not authorized in the Vipps app.' : 'Please try a different payment method.'}`);
                break;
              case 'requires_action':
                setMessage(`${paymentMethodName} payment requires additional action. ${isVipps ? 'Please check your Vipps app.' : 'Please complete the authentication.'}`);
                break;
              default:
                setMessage(`Something went wrong with the ${paymentMethodName} payment.`);
            }
          }
        } catch (error) {
          setMessage('Error retrieving payment status');
        }
        return;
      }

      // Fallback: if no specific parameters, show error
      if (!clientSecret && !paymentIntentId) {
        setMessage('No payment information found. Please start a new payment.');
      }
    })();
  }, []);

  return (
    <div className="p-8 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-semibold mb-4">Payment Status</h1>
      <div className={`p-4 rounded-lg border ${
        status === 'succeeded' ? 'bg-green-50 border-green-200 text-green-800' :
        status === 'processing' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
        'bg-red-50 border-red-200 text-red-800'
      }`}>
        <p className="text-lg">{message}</p>
      </div>
      {status === 'succeeded' && (
        <div className="mt-6">
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Make Another Payment
          </a>
        </div>
      )}
    </div>
  );
}
