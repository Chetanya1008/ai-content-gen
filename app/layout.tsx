import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Postcraft AI — Social Media Content Generator",
  description: "Generate platform-perfect social media content for LinkedIn, Twitter/X, and Instagram using AI.",
  keywords: ["social media", "content generator", "AI", "LinkedIn", "Twitter", "Instagram"],
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
