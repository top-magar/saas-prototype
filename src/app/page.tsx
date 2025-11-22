import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { SocialProof } from '@/components/landing/social-proof';
import { ProblemSolution } from '@/components/landing/problem-solution';
import { Features } from '@/components/landing/features';
import { Testimonials } from '@/components/landing/testimonials';
import { FAQ } from '@/components/landing/faq';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <ProblemSolution />
        <Features />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}