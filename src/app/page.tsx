import PaymentMethods from "@/components/PaymentMethods";

export default function page() {

  
  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl mb-6 font-semibold text-center">Choose Payment Method</h1>
      <PaymentMethods/>
    </main>
  );
}