// app/api/confirm-payment/route.ts
import { stripe } from '@/app/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, returnUrl } = await request.json();

    if (!paymentIntentId) {
      return new NextResponse('Missing paymentIntentId', { status: 400 });
    }

    // Confirm the PaymentIntent
    const confirmedIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/complete`,
    });

    return NextResponse.json({
      status: confirmedIntent.status,
      clientSecret: confirmedIntent.client_secret,
      nextAction: confirmedIntent.next_action,
    });
  } catch (err: any) {
    console.error('PaymentIntent confirmation failed:', err);
    return new NextResponse(`Failed to confirm payment: ${err.message}`, { status: 500 });
  }
}