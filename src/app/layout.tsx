import { fontClasses } from "@/lib/fonts";
import { Metadata } from 'next';
import "../styles/index.css";
import "../styles/geometric.css";
// import { QueryProvider } from '@/lib/providers/query-provider';
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: {
    default: 'PASAAL - Multi-tenant SaaS Platform for Nepal',
    template: '%s | PASAAL'
  },
  description: 'Automate your inventory, sales, and customer management with PASAAL - the leading SaaS platform built for Nepali businesses.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontClasses.variables} font-sans`} suppressHydrationWarning>
        <AuthProvider>
          {/* <QueryProvider> */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            {children}
          </ThemeProvider>
          {/* </QueryProvider> */}
        </AuthProvider>
      </body>
    </html>
  );
}
