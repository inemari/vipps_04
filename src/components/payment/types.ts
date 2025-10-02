/**
 * Minimal types for payment
 */

export type PaymentMethod = {
  label: string;
  value: { type: string };
};

export interface VippsPaymentData {
  clientSecret: string;
  paymentIntentId: string;
}

export interface PaymentResponse {
  status: string;
  nextAction?: {
    redirect_to_url?: {
      url: string;
    };
  };
}
