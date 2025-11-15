import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
// Marketing styles are now in the main CSS structure

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}