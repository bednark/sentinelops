import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import ApolloClientProvider from "@/components/providers/ApolloProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SentinelOps Dashboard",
  description: "Monitor and manage agents across your infrastructure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="h-full dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-screen bg-slate-950 text-slate-100 antialiased`}
      >
        <AppShell>
          <ApolloClientProvider>
          {children}
          </ApolloClientProvider>
        </AppShell>
      </body>
    </html>
  );
}
