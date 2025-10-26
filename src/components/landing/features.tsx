'use client';

import { motion, Variants } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package, ShoppingCart, Workflow } from 'lucide-react';

// Define the features array ONCE, outside the component.
const features = [
  {
    icon: <Package className="h-8 w-8 text-primary" />,
    title: 'Product & Inventory Management',
    description: 'Easily add products, track stock levels in real-time, and manage categories to keep your inventory organized and efficient.',
  },
  {
    icon: <ShoppingCart className="h-8 w-8 text-primary" />,
    title: 'Orders & Sales Hub',
    description: 'A centralized dashboard to manage all your orders, generate invoices, track payments, and get a complete view of your customer data.',
  },
  {
    icon: <Workflow className="h-8 w-8 text-primary" />,
    title: 'Powerful Automation',
    description: 'Automate repetitive tasks with custom workflows. Integrate with your favorite tools using webhooks and a robust API.',
  },
];

export function Features() {
  const FADE_IN_ANIMATION_VARIANTS: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  };

  return (
    <section className="container py-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Everything You Need to Succeed</h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Powerful features designed to streamline your operations and fuel your growth.
        </p>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial="hidden"
            whileInView="show"
            variants={FADE_IN_ANIMATION_VARIANTS}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                {feature.icon}
                <CardTitle className="mt-4">{feature.title}</CardTitle>
                <CardDescription className="mt-2">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}