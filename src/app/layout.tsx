import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RfpProvider } from "@/providers/rfp-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "RFP Agent OS | Genius Sports",
  description:
    "AI-powered RFP operating system for media commercial workflow — intake, Solution Brief, routing, and proposal synthesis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full font-body">
        <TooltipProvider>
          <RfpProvider>{children}</RfpProvider>
        </TooltipProvider>
      <Analytics />
        </body>
    </html>
  );
}
