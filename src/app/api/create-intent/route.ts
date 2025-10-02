// app/api/create-intent/route.ts
import { stripe } from "@/app/lib/stripe";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/app/lib/api-utils";

export async function POST() {
  try {
    const amount = 19900;

    // Create PaymentIntent based on payment method
    const intentParams = {
      amount,
      currency: "nok",
      payment_method_types: ["vipps", "card", "paypal"],
    };

    // Create the PaymentIntent with proper headers for Vipps beta
    const intent = await stripe.paymentIntents.create(intentParams, {
      apiVersion: "2025-03-31.basil;vipps_preview=v1",
    } as Parameters<typeof stripe.paymentIntents.create>[1]);

    return createSuccessResponse({
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
    });
  } catch (err: unknown) {
    return createErrorResponse("Failed to create payment intent", err);
  }
}
