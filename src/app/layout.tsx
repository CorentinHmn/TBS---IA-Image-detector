import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prism",
  description: "Detect AI-generated images with forensic-grade confidence analysis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: 'Satoshi, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
