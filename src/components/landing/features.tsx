"use client";
import { motion } from 'motion/react';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { Package, ShoppingCart, Workflow, BarChart3, Users, Zap, TrendingUp, Shield } from 'lucide-react';
import styles from './features.module.css';

const features = [
  {
    title: "Smart Inventory Management",
    description: "Real-time stock tracking, automated reorder alerts, and intelligent forecasting to optimize your inventory levels.",
    header: <FeatureHeader icon={Package} color="from-blue-500 to-cyan-500" />,
    icon: <Package className="h-4 w-4 text-primary" />,
    className: "md:col-span-2",
  },
  {
    title: "Sales & Orders Hub",
    description: "Streamlined order processing, automated invoicing, and comprehensive sales tracking in one unified platform.",
    header: <FeatureHeader icon={ShoppingCart} color="from-green-500 to-emerald-500" />,
    icon: <ShoppingCart className="h-4 w-4 text-primary" />,
    className: "md:col-span-1",
  },
  {
    title: "Customer Management",
    description: "Build stronger relationships with comprehensive customer profiles, purchase history, and personalized communication tools.",
    header: <FeatureHeader icon={Users} color="from-purple-500 to-pink-500" />,
    icon: <Users className="h-4 w-4 text-primary" />,
    className: "md:col-span-1",
  },
  {
    title: "Business Analytics",
    description: "Data-driven insights with interactive dashboards, performance metrics, and predictive analytics to grow your business.",
    header: <FeatureHeader icon={TrendingUp} color="from-orange-500 to-red-500" />,
    icon: <TrendingUp className="h-4 w-4 text-primary" />,
    className: "md:col-span-2",
  },
];

function FeatureHeader({ icon: Icon, color }: { icon: any; color: string }) {
  return (
    <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-muted to-background relative overflow-hidden group">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative z-10 flex items-center justify-center w-full h-full"
      >
        <Icon className="h-16 w-16 text-primary drop-shadow-lg" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

export function Features() {
  return (
    <section className={`${styles.features} py-24 relative overflow-hidden`}>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Zap className="w-4 h-4" />
            Powerful Features
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Everything You Need to{" "}
            <span className={styles.gradientText}>
              Scale & Succeed
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Comprehensive tools and intelligent automation designed to transform your business operations and accelerate growth.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <BentoGrid className="max-w-6xl mx-auto">
            {features.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <BentoGridItem
                  title={item.title}
                  description={item.description}
                  header={item.header}
                  icon={item.icon}
                  className={`${item.className} hover:shadow-xl transition-all duration-500 border-2 hover:border-primary/20`}
                />
              </motion.div>
            ))}
          </BentoGrid>
        </motion.div>
      </div>
    </section>
  );
}