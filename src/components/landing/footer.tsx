import Link from 'next/link';
import { Package } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <Package className="h-6 w-6" />
              <span className="font-bold">SaaS Platform</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage your business with ease.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-2 text-sm">
              <h4 className="font-semibold">Product</h4>
              <Link href="#" className="text-muted-foreground hover:text-foreground">Features</Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">Pricing</Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">Docs</Link>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <h4 className="font-semibold">Company</h4>
              <Link href="#" className="text-muted-foreground hover:text-foreground">About Us</Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link>
            </div>
            {/* Add more links if needed */}
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SaaS Platform Nepal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}