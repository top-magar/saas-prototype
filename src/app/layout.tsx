import { ClerkProvider } from '@clerk/nextjs';
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


export const metadata = {
  title: 'Nepal SaaS Platform',
  description: 'Multi-tenant SaaS platform built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={geistSans.variable}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
