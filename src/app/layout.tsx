import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "CampusIQ — AI Student OS", template: "%s | CampusIQ" },
  description: "AI-powered adaptive semester roadmap, career guidance, study assistant, and college management — all in one student platform.",
  keywords: ["AI", "student", "roadmap", "career", "study assistant", "exam prep", "college management"],
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider>
            <Toaster position="top-right" richColors />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
