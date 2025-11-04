"use client";
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, Play } from 'lucide-react';
import { OptimizedImage } from '@/components/optimized-image';
import styles from './hero.module.css';

export function Hero() {
  return (
    <section className={`${styles.hero} relative min-h-screen flex items-center justify-center overflow-hidden pt-20`}>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Problem-focused headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 px-4 py-2 mb-6">
              ⚠️ Business Problem Alert
            </Badge>
            <h1 className={`${styles.title} text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight`}>
              {"Stop Losing Money to Manual Business Management"
                .split(" ")
                .map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.3 + index * 0.1,
                    }}
                    className="mr-3 inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
            </h1>
          </motion.div>

          {/* Solution-oriented subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            Pasaal.io automates your inventory, sales, and customer management so you can focus on growing your business in Nepal&apos;s competitive market
          </motion.p>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex items-center justify-center gap-6 mb-10 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button size="lg" asChild className={`${styles.ctaButton} h-14 px-8 text-lg group`}>
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

          {/* Product preview with play button */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="relative group cursor-pointer"
          >
            <div className="relative rounded-2xl border-2 border-border bg-card p-4 shadow-2xl hover:shadow-3xl transition-all duration-500">
              <div className="relative overflow-hidden rounded-xl">
                <OptimizedImage
                  src="/images/dashboard/dashboard-preview.png"
                  alt="Pasaal.io Dashboard - Real Business Management"
                  width={1200}
                  height={800}
                  priority
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
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