"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Play, Users, LogIn, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
// Styles moved to organized CSS structure

const SCROLL_THRESHOLD = 10;
const THROTTLE_DELAY = 16;

function throttle(func: Function, delay: number) {
  let timeoutId: NodeJS.Timeout;
  let lastExecTime = 0;
  return function (this: any, ...args: any[]) {
    const currentTime = Date.now();
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    }
  };
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = useMemo(() => [
    { name: 'Product', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Customers', href: '#testimonials' },
    { name: 'Resources', href: '#faq' },
  ], []);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  const throttledHandleScroll = useMemo(
    () => throttle(handleScroll, THROTTLE_DELAY),
    [handleScroll]
  );

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [throttledHandleScroll]);

  const handleSmoothScroll = useCallback((href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <header className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300 backdrop-blur-sm",
      isScrolled ? "bg-background/95 border-b border-border" : "bg-transparent border-transparent"
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
          <Link href="/" className="flex items-center space-x-3 z-50" aria-label="Pasaal Home">
            <div>
              <span className="font-bold text-2xl font-sans">Pasaal</span>
            </div>
            <Image 
              src="/svg/logo.svg" 
              alt="Pasaal Logo" 
              width={32} 
              height={32} 
              priority
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-sm px-2 py-1"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll(link.href);
                }}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/sign-up">Start Free Trial</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          {mounted && <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                aria-label="Open mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-6">
                {/* Mobile Navigation Links */}
                <nav className="flex flex-col space-y-4" role="navigation" aria-label="Mobile navigation">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name}
                      href={link.href}
                      className="text-base font-medium py-2 px-3 rounded-md hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSmoothScroll(link.href);
                        closeMobileMenu();
                      }}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col space-y-3 pt-6 border-t">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/sign-in" onClick={closeMobileMenu}>
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/sign-up" onClick={closeMobileMenu}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Get Started
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>}
        </div>
      </div>
    </header>
  );
}