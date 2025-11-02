"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Github, Linkedin, Mail, Heart, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import styles from './footer.module.css';

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Integrations', href: '#integrations' },
    { name: 'API Docs', href: '#api' },
    { name: 'Changelog', href: '#changelog' },
  ],
  company: [
    { name: 'About Us', href: '#about' },
    { name: 'Careers', href: '#careers' },
    { name: 'Press Kit', href: '#press' },
    { name: 'Blog', href: '#blog' },
    { name: 'Partners', href: '#partners' },
  ],
  support: [
    { name: 'Help Center', href: '#help' },
    { name: 'Community', href: '#community' },
    { name: 'Contact Us', href: '#contact' },
    { name: 'System Status', href: '#status' },
    { name: 'Security', href: '#security' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Cookie Policy', href: '#cookies' },
    { name: 'GDPR', href: '#gdpr' },
  ],
};

const socialLinks = [
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'GitHub', href: '#', icon: Github },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'Email', href: 'mailto:hello@pasaal.io', icon: Mail },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`${styles.footer} relative overflow-hidden`}>
      {/* Back to top button */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-8 right-8 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>

      <div className="container mx-auto px-4 py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Link href="/" className="flex items-center space-x-3 mb-6 group">
              <div className="relative">
                <Image src="/logo.svg" alt="Pasaal.io Logo" width={40} height={40} className="group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse" />
              </div>
              <span className={`font-bold text-2xl ${styles.gradientText}`}>
                PASAAL.IO
              </span>
            </Link>
            <p className={`${styles.textSecondary} mb-8 max-w-sm text-lg leading-relaxed`}>
              Empowering businesses across Nepal with intelligent automation and comprehensive management solutions.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.div
                    key={social.name}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="hover:bg-primary/20 hover:text-primary transition-all duration-300 hover:scale-110"
                    >
                      <Link href={social.href} aria-label={social.name}>
                        <Icon className="h-5 w-5" />
                      </Link>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          
          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold mb-6 text-foreground text-lg capitalize">{category}</h4>
              <ul className="space-y-4">
                {links.map((link, linkIndex) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: linkIndex * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link 
                      href={link.href} 
                      className={`${styles.textSecondary} hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block`}
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="pt-8 border-t-2 border-border/30 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <p className={`text-base ${styles.textSecondary} flex items-center gap-2`}>
            © {new Date().getFullYear()} Pasaal.io. All rights reserved.
          </p>
          <p className={`text-base ${styles.textSecondary} flex items-center gap-2`}>
            Made with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> in Nepal 🇳🇵
          </p>
        </motion.div>
      </div>
    </footer>
  );
}