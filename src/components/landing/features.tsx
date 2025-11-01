"use client";
import { motion } from 'framer-motion';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { Package, ShoppingCart, Workflow, BarChart3, Shield, Zap } from 'lucide-react';

const features = [
  {
    title: "Product & Inventory Management",
    description: "Easily add products, track stock levels in real-time, and manage categories to keep your inventory organized and efficient.",
    header: <FeatureHeader icon={Package} />,
    icon: <Package className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-2",
  },
  {
    title: "Orders & Sales Hub",
    description: "A centralized dashboard to manage all your orders, generate invoices, track payments, and get a complete view of your customer data.",
    header: <FeatureHeader icon={ShoppingCart} />,
    icon: <ShoppingCart className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-1",
  },
  {
    title: "Powerful Automation",
    description: "Automate repetitive tasks with custom workflows. Integrate with your favorite tools using webhooks and a robust API.",
    header: <FeatureHeader icon={Workflow} />,
    icon: <Workflow className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-1",
  },
  {
    title: "Advanced Analytics",
    description: "Get deep insights into your business performance with comprehensive analytics and reporting tools.",
    header: <FeatureHeader icon={BarChart3} />,
    icon: <BarChart3 className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-2",
  },
];

function FeatureHeader({ icon: Icon }: { icon: any }) {
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-50" />
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <Icon className="h-12 w-12 text-primary" />
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section className="py-20 bg-neutral-50 dark:bg-neutral-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to streamline your operations and fuel your growth.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <BentoGrid className="max-w-4xl mx-auto">
            {features.map((item, i) => (
              <BentoGridItem
                key={i}
                title={item.title}
                description={item.description}
                header={item.header}
                icon={item.icon}
                className={item.className}
              />
            ))}
          </BentoGrid>
        </motion.div>
      </div>
    </section>
  );
}