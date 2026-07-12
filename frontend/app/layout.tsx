import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KuyTanya - WhatsApp Auto-Reply Dashboard",
  description: "Manage WhatsApp auto-reply rules and monitor incoming messages from one dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
