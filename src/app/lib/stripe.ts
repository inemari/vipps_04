// lib/stripe.ts

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Include your account's current API version AND the Vipps w flag per Stripe docs.
  // Using the specific version mentioned in the error message for Vipps beta access
  apiVersion: "2025-03-31.basil;vipps_preview=v1" as any, // Required version for Vipps beta feature
});
