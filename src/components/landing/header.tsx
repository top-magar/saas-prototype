"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Package, Menu, X, LogIn, UserPlus, DollarSign } from 'lucide-react';
import { PricingDialog } from '@/components/pricing-dialog';
import { Dialog } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

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
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing', isPricing: true },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300",
      isScrolled 
        ? "bg-background/95 backdrop-blur-md border-b shadow-sm" 
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 z-50">
            <Package className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">
              PASSAL.IO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.isPricing ? (
                <Dialog key={link.name}>
                  <PricingDialog 
                    trigger={
                      <Button variant="ghost" className="text-sm font-medium">
                        {link.name}
                      </Button>
                    } 
                    showPaymentMethods={false} 
                  />
                </Dialog>
              ) : (
                <Link 
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              )
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/sign-in" className="flex items-center space-x-2">
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up" className="flex items-center space-x-2">
                <UserPlus className="h-4 w-4" />
                <span>Get Started</span>
              </Link>
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
                    link.isPricing ? (
                      <Dialog key={link.name}>
                        <PricingDialog 
                          trigger={
                            <Button 
                              variant="ghost" 
                              className="justify-start text-base font-medium"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <DollarSign className="h-5 w-5 mr-3" />
                              {link.name}
                            </Button>
                          } 
                          showPaymentMethods={false} 
                        />
                      </Dialog>
                    ) : (
                      <Link 
                        key={link.name}
                        href={link.href}
                        className="text-base font-medium py-2 px-3 rounded-md hover:bg-muted transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    )
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