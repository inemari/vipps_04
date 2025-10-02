import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vipps Payment Demo",
  description: "Vipps payment integration with Next.js and Stripe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
