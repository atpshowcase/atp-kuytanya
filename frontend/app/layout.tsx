import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KuyTanya — Dasbor Balasan Otomatis WhatsApp",
  description:
    "Kelola aturan balasan otomatis WhatsApp Anda dan pantau pesan masuk dari dasbor terpusat.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}
