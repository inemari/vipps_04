// app/api/create-intent/route.ts
import { stripe } from '@/app/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { paymentMethod = 'vipps' } = await request.json();
    const amount = 19900;

    // Create PaymentIntent based on payment method
    const intentParams: any = {
      amount,
      currency: 'nok',
    };

    if (paymentMethod === 'vipps') {
      // Direct API approach for Vipps
      intentParams.payment_method_types = ['vipps'];
      intentParams.payment_method_data = {
        type: 'vipps' as any, // Cast to any due to private preview
      };
      // return_url will be added during confirmation step
    } else if (paymentMethod === 'paypal') {
      // Payment Element approach for PayPal
      intentParams.payment_method_types = ['paypal'];
      intentParams.confirmation_method = 'automatic';
      // return_url not needed - Payment Element handles this
    } else {
      // Payment Element approach for cards (default)
      intentParams.payment_method_types = ['card'];
      intentParams.confirmation_method = 'automatic';
      // return_url not needed - Payment Element handles this
    }

    const intent = await stripe.paymentIntents.create(intentParams);

    return NextResponse.json({ 
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id 
    });
  } catch (err: any) {
    console.error('PaymentIntent creation failed:', err);
    return new NextResponse(`Failed to create payment intent: ${err.message}`, { status: 500 });
  }
}
