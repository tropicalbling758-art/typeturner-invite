import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Island Gyal™ | Premium Caribbean Fashion & Lifestyle",
  description: "AI-powered Caribbean fashion and lifestyle platform. Discover luxury swimwear, carnival accessories, and personalized styling with Breeze™.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
