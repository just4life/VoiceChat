import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voice Chat Web App",
  description: "Self-hosted TeamSpeak-like voice chat"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
