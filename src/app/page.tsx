import { SignedIn, SignedOut } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { FAQ } from '@/components/landing/faq';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <>
      <SignedIn>
        {/* This correctly redirects already-signed-in users to the dashboard */}
        {redirect("/dashboard")}
      </SignedIn>
      <SignedOut>
        {/* This will render the new landing page for signed-out users */}
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Hero />
            <Features />
            <FAQ />
          </main>
          <Footer />
        </div>
      </SignedOut>
    </>
  );
}