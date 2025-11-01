import { SignedIn, SignedOut } from "@clerk/nextjs";
import { RedirectToSignIn } from "@clerk/nextjs";
import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { FAQ } from '@/components/landing/faq';
import { Footer } from '@/components/landing/footer';
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <>
      <SignedIn>
        <RedirectToDashboard />
      </SignedIn>
      <SignedOut>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pt-16">
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

function RedirectToDashboard() {
  redirect("/dashboard");
  return null;
}