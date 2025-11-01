"use client";
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'Is this platform suitable for small businesses?',
    answer: 'Absolutely! Our platform is designed to scale. The "Starter" tier is perfect for small businesses and startups looking to get organized and grow.',
  },
  {
    question: 'Can I integrate my own tools?',
    answer: 'Yes. Our platform provides a robust API and webhook support, allowing you to connect to a wide range of third-party services and build custom integrations.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Security is our top priority. Your data is isolated in its own tenant and all connections are encrypted. We use Clerk for authentication, which provides industry-standard security features.',
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'We offer email support for all plans. Customers on our "Professional" and "Enterprise" tiers receive priority support and dedicated account management.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.',
  },
  {
    question: 'Do you offer a free trial?',
    answer: 'Yes! We offer a 14-day free trial for all paid plans. No credit card required to get started.',
  },
];

export function FAQ() {
  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get answers to the most common questions about our platform.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <AccordionItem 
                  value={`item-${i}`} 
                  className="border border-border/50 rounded-lg px-6 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors duration-300"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <span className="font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}