"use client";
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, Play } from 'lucide-react';
import { transitions, variants } from '@/lib/animations';
// import { OptimizedImage } from '@/components/optimized-image';
// Styles moved to organized CSS structure

export function Hero() {
  return (
    <section className="hero-bg relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Problem-focused headline */}
          <motion.div
            variants={variants.fadeInUp}
            initial="initial"
            animate="animate"
            transition={transitions.default}
            className="mb-8"
          >
            <Badge variant="outline" className="border-red-200 bg-red-50/50 text-red-700 px-4 py-2 mb-6 hover:bg-red-100/50 transition-colors">
              ⚠️ Business Problem Alert
            </Badge>
            <h1 className="marketing-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight" aria-label="Stop Losing Money to Manual Business Management">
              {"Stop Losing Money to Manual Business Management"
                .split(" ")
                .map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      ...transitions.default,
                      delay: 0.2 + index * 0.05,
                    }}
                    className="mr-3 inline-block"
                    aria-hidden="true"
                  >
                    {word}
                  </motion.span>
                ))}
            </h1>
          </motion.div>

          {/* Solution-oriented subheading */}
          <motion.p
            variants={variants.fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ ...transitions.default, delay: 0.6 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            Pasaal.io automates your inventory, sales, and customer management so you can focus on growing your business in Nepal&apos;s competitive market
          </motion.p>

          {/* Social proof */}
          <motion.div
            variants={variants.fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ ...transitions.default, delay: 0.8 }}
            className="flex items-center justify-center gap-6 mb-10 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background" />
                ))}
              </div>
              <span>500+ businesses</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <span>⭐⭐⭐⭐⭐ 4.9/5 rating</span>
            <div className="w-px h-4 bg-border" />
            <span>🇳🇵 Made in Nepal</span>
          </motion.div>

          {/* Risk-free CTA */}
          <motion.div
            variants={variants.fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ ...transitions.default, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button size="lg" asChild className="marketing-cta h-14 px-8 text-lg group">
              <Link href="/sign-up" className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Start 14-Day Free Trial</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              ✓ No credit card required • ✓ Setup in 10 minutes • ✓ Cancel anytime
            </div>
          </motion.div>

          {/* Product preview */}
          <motion.div
            variants={variants.scaleIn}
            initial="initial"
            animate="animate"
            transition={{ ...transitions.slow, delay: 1.2 }}
            className="relative group cursor-pointer"
          >
            <div className="relative rounded-2xl border-2 border-border bg-card p-4 shadow-2xl hover:shadow-3xl transition-all duration-500">
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src="/images/dashboard/dashboard-preview.png"
                  alt="Pasaal.io Dashboard Preview"
                  width={1400}
                  height={800}
                  quality={100}
                  priority
                  className="w-full h-auto rounded-xl"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}