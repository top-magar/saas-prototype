"use client";
import { motion } from 'motion/react';
import Image from 'next/image';

const customers = [
  { name: "Nepal Bank", logo: "/images/logos/company-logo.svg" },
  { name: "Himalayan Java", logo: "/images/logos/company-logo.svg" },
  { name: "Bhatbhateni", logo: "/images/logos/company-logo.svg" },
  { name: "CG Group", logo: "/images/logos/company-logo.svg" },
  { name: "Nabil Bank", logo: "/images/logos/company-logo.svg" },
  { name: "Daraz Nepal", logo: "/images/logos/company-logo.svg" },
];

const metrics = [
  { value: "500+", label: "Active Businesses" },
  { value: "50K+", label: "Transactions Daily" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9/5", label: "Customer Rating" },
];

export function SocialProof() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Customer Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm text-muted-foreground mb-8 font-medium">
            Trusted by leading businesses across Nepal
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60 hover:opacity-100 transition-opacity duration-500">
            {customers.map((customer, index) => (
              <motion.div
                key={customer.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              >
                <Image
                  src={customer.logo}
                  alt={`${customer.name} logo`}
                  width={120}
                  height={60}
                  loading="lazy"
                  className="h-8 w-auto"
                  sizes="120px"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {metric.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}