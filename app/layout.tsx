import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sector 01 — Checkpoint",
  description: "Command five operators, hold the industrial checkpoint, and stop 35 hostiles in an animated tactical tower-defense game.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
