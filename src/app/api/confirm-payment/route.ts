// app/api/confirm-payment/route.ts
import { stripe } from "@/app/lib/stripe";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/app/lib/api-utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, returnUrl } = await request.json();

    if (!paymentIntentId) {
      return new NextResponse("Missing paymentIntentId", { status: 400 });
    }

    // Confirm the PaymentIntent with Vipps payment method
    const confirmedIntent = await stripe.paymentIntents.confirm(
      paymentIntentId,
      {
        payment_method_data: {
          type: "vipps",
        },
        return_url: returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/complete`,
      } as Parameters<typeof stripe.paymentIntents.confirm>[1]
    );

    return createSuccessResponse({
      status: confirmedIntent.status,
      clientSecret: confirmedIntent.client_secret,
      nextAction: confirmedIntent.next_action,
    });
  } catch (err: unknown) {
    return createErrorResponse("Failed to confirm payment", err);
  }
}
