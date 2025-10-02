"use client";
import { PaymentElement } from "@stripe/react-stripe-js";
import { usePaymentForm } from "./usePaymentForm";

export const PaymentForm = () => {
  const { isProcessing, selectedMethod, selectMethod, handleSubmit } =
    usePaymentForm();

  return (
    <form
      onSubmit={handleSubmit}
      className=" flex flex-col justify-between min-h-[500px] "
      id="payment-form"
    >
      <div className="h-full gap-2 flex flex-col">
        <PaymentElement
          onChange={(event) => {
            selectMethod({
              label: event.value.type,
              value: { type: event.value.type },
            });
          }}
          options={{
            layout: {
              type: "accordion",
              radios: true,
              spacedAccordionItems: true,
            },
          }}
        />
      </div>
      <button id="submit" type="submit" disabled={isProcessing}>
        {isProcessing
          ? "Processing..."
          : `Pay with ${selectedMethod?.value.type}`}
      </button>
    </form>
  );
};
