import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { PricingDialog } from '@/components/pricing-dialog';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Package className="h-6 w-6" />
            <span className="font-bold">SaaS Platform</span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center space-x-4 justify-end">
          <Dialog>
            <PricingDialog trigger={<Button variant="ghost">Pricing</Button>} showPaymentMethods={false} />
          </Dialog>
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}