import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sector 01 — Tactical Operations",
  description: "Deploy five anime chibi operators across three atmospheric tactical-defense missions with directional combat, distinct bosses, and landscape mobile play.",
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
