/**
 * Ultra-simple payment hook
 */
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { PaymentMethod } from "./types";

export const usePaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>();

  const selectMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };
  const processVippsPayment = async () => {
    try {
      const createRes = await fetch("/api/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const { paymentIntentId } = await createRes.json();

      const confirmRes = await fetch("/api/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId,
          returnUrl: `${window.location.origin}/complete`,
        }),
      });
      const { status, nextAction } = await confirmRes.json();

      if (status === "requires_action" && nextAction?.redirect_to_url) {
        window.location.href = nextAction.redirect_to_url.url;
      }
    } catch (error) {
      console.error("Vipps payment error:", error);
    }
  };

  const processStripePayment = async () => {
    if (!stripe || !elements) return;

    try {
      await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/complete` },
      });
    } catch (error) {
      console.error("Stripe payment error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (selectedMethod?.value.type === "vipps") {
        await processVippsPayment();
      } else {
        // Handle card or paypal through Stripe
        await processStripePayment();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    selectedMethod,
    selectMethod,
    handleSubmit,
  };
};
