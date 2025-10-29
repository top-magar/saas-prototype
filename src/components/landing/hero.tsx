/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion'; // Import Variants type
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Hero() {
  // Explicitly type the constant with Variants
  const FADE_UP_ANIMATION_VARIANTS: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  };

  return (
    <motion.section
      initial="hidden"
      animate="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      className="container flex flex-col items-center justify-center py-20 md:py-32 text-center"
    >
      <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
        <Badge variant="outline" className="mb-4">
          Built for Businesses in Nepal
        </Badge>
      </motion.div>
              <motion.h1
              variants={FADE_UP_ANIMATION_VARIANTS}
              className="text-3xl md:text-5xl font-bold tracking-tight max-w-4xl"
            >
              {`Your Business`}&#39;s, Simplified. Powerful SaaS for Growth.
            </motion.h1>      <motion.p
        variants={FADE_UP_ANIMATION_VARIANTS}
        className="mt-6 text-base text-muted-foreground max-w-2xl"
      >
        Effortlessly manage sales, inventory, and customer relationships. Gain insights to make smarter decisions and unlock your business's full potential.
      </motion.p>
      <motion.div
        variants={FADE_UP_ANIMATION_VARIANTS}
        className="mt-8 flex gap-4"
      >
        <Button size="lg" asChild>
          <Link href="/sign-up">Get Started for Free</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </motion.div>
    </motion.section>
  );
}