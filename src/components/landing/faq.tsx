"use client";
import { motion } from 'motion/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, MessageCircle } from 'lucide-react';
import styles from './faq.module.css';

const faqs = [
  {
    question: 'How quickly can I get started with Pasaal.io?',
    answer: 'You can be up and running in minutes! Our intuitive setup wizard guides you through the initial configuration, and you can start managing your business immediately with our 14-day free trial.',
  },
  {
    question: 'Is Pasaal.io suitable for my business size?',
    answer: 'Absolutely! Whether you&apos;re a solo entrepreneur or managing a growing team, our platform scales with your business. From startups to established enterprises, we have plans that fit every stage of growth.',
  },
  {
    question: 'Can I integrate with my existing tools and systems?',
    answer: 'Yes! Pasaal.io offers comprehensive API access, webhook support, and pre-built integrations with popular tools. Our technical team can also assist with custom integrations for enterprise clients.',
  },
  {
    question: 'How secure is my business data?',
    answer: 'Security is paramount. We use enterprise-grade encryption, secure data centers, and follow international compliance standards. Your data is isolated, regularly backed up, and protected with multi-factor authentication.',
  },
  {
    question: 'What support options are available?',
    answer: 'We provide 24/7 email support for all users, live chat for premium plans, and dedicated account managers for enterprise clients. Plus, our comprehensive knowledge base and video tutorials help you succeed.',
  },
  {
    question: 'Can I customize the platform for my specific needs?',
    answer: 'Definitely! Pasaal.io offers extensive customization options including custom fields, workflows, reports, and branding. Enterprise plans include white-label options and custom development services.',
  },
];

export function FAQ() {
  return (
    <section className={`${styles.faq} py-24 relative`}>
      <div className="container max-w-5xl mx-auto px-4">
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
            <MessageCircle className="w-4 h-4" />
            Got Questions?
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Frequently Asked{" "}
            <span className={styles.gradientText}>
              Questions
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about Pasaal.io. Can&apos;t find what you&apos;re looking for? 
            <span className="text-primary font-medium"> Contact our support team.</span>
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full space-y-6">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <AccordionItem 
                  value={`item-${i}`} 
                  className="border-2 border-border/30 rounded-2xl px-8 py-2 bg-card/30 backdrop-blur-sm hover:bg-card/60 hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-lg"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-8 text-lg font-semibold group-hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 text-muted-foreground leading-relaxed text-base">
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