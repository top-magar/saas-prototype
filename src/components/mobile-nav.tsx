'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, ShoppingBag, Package, BarChart, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
    action?: () => void;
}

export function MobileNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { toggleSidebar } = useSidebar();

    const navItems: NavItem[] = [
        {
            name: 'Home',
            href: '/dashboard',
            icon: Home,
        },
        {
            name: 'Orders',
            href: '/dashboard/orders',
            icon: ShoppingBag,
        },
        {
            name: 'Products',
            href: '/dashboard/products',
            icon: Package,
        },
        {
            name: 'Analytics',
            href: '/dashboard/analytics',
            icon: BarChart,
        },
        {
            name: 'Menu',
            href: '#',
            icon: Menu,
            action: () => toggleSidebar(),
        },
    ];

    const handleNavigation = (item: NavItem) => {
        if (item.action) {
            item.action();
        } else {
            router.push(item.href);
        }
    };

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-sm border-t border-border">
            <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = item.href !== '#' && isActive(item.href);

                    return (
                        <button
                            key={item.name}
                            onClick={() => handleNavigation(item)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]",
                                active
                                    ? "text-primary bg-primary/10"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
