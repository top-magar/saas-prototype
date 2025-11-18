import { ClerkProvider } from '@clerk/nextjs';
import { fontClasses } from "@/lib/fonts";
import { Metadata } from 'next';
import "../styles/index.css";
import "../styles/geometric.css";
import { QueryProvider } from '@/lib/providers/query-provider';
import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata: Metadata = {
  title: {
    default: 'PASAAL.IO - Multi-tenant SaaS Platform for Nepal',
    template: '%s | PASAAL.IO'
  },
  description: 'Automate your inventory, sales, and customer management with PASAAL.IO - the leading SaaS platform built for Nepali businesses.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#000000',
        },
      }}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${fontClasses.variables} font-sans`} suppressHydrationWarning>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
            >
              {children}
            </ThemeProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
