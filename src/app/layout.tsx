import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "../context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "True Feedback - Anonymous Feedback Platform",
  description: "Get real, anonymous feedback from real people. Share your thoughts and receive honest messages from others. Join True Feedback to start your anonymous feedback journey.",
  keywords: ["anonymous feedback", "anonymous messages", "feedback platform", "anonymous communication", "true feedback"],
  authors: [{ name: "True Feedback" }],
  openGraph: {
    title: "True Feedback - Anonymous Feedback Platform",
    description: "Get real, anonymous feedback from real people. Share your thoughts and receive honest messages from others.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
