"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Play, Users, LogIn, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './header.module.css';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Product', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Customers', href: '#testimonials' },
    { name: 'Resources', href: '#faq' },
  ];

  return (
    <header className={cn(
      styles.header,
      "fixed top-0 z-50 w-full transition-all duration-300",
      isScrolled ? styles.headerScrolled : "bg-transparent border-transparent"
    )}>
      {/* Trust Banner */}
      {!isScrolled && (
        <div className="bg-primary text-primary-foreground text-center py-2 text-sm">
          <div className="container mx-auto px-4 flex items-center justify-center gap-2">
            <Users className="w-4 h-4" />
            <span>Trusted by 500+ Nepal businesses • 50,000+ transactions processed</span>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 z-50">
            <Image src="/images/logos/company-logo.svg" alt="Pasaal.io Logo" width={32} height={32} priority />
            <div>
              <span className="font-bold text-xl">PASAAL.IO</span>
              <Badge variant="secondary" className="ml-2 text-xs">Nepal</Badge>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" asChild className="text-sm">
              <Link href="#demo" className="flex items-center space-x-2">
                <Play className="h-4 w-4" />
                <span>Watch Demo</span>
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/sign-up">Start Free Trial</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-6">
                {/* Mobile Navigation Links */}
                <div className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name}
                      href={link.href}
                      className="text-base font-medium py-2 px-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col space-y-3 pt-6 border-t">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Get Started
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}