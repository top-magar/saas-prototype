"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spotlight } from '@/components/ui/spotlight';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black/[0.02] dark:bg-black">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="blue" />
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center space-y-8"
        >
          <Badge 
            variant="outline" 
            className="border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors duration-300 px-4 py-2 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Built for Businesses in Nepal
          </Badge>
          
          <div className="max-w-4xl">
            <TextGenerateEffect 
              words="Your Business, Simplified. Powerful SaaS for Growth."
              className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-50 dark:to-neutral-400 bg-clip-text text-transparent"
            />
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            Effortlessly manage sales, inventory, and customer relationships. 
            Gain insights to make smarter decisions and unlock your business's full potential.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Button 
              size="lg" 
              asChild 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Link href="/sign-up" className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Get Started for Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className="border-2 hover:bg-muted/50 transition-all duration-300"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
    </section>
  );
}