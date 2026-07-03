import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATP Chatbot — WhatsApp Auto-Reply Dashboard",
  description:
    "Manage your WhatsApp auto-reply rules and monitor incoming messages from a central dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
