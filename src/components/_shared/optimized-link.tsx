'use client';
import Link from 'next/link';
import { useState } from 'react';

interface OptimizedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetchOnHover?: boolean;
}

export function OptimizedLink({ 
  href, 
  children, 
  className, 
  prefetchOnHover = false 
}: OptimizedLinkProps) {
  const [shouldPrefetch, setShouldPrefetch] = useState(!prefetchOnHover);

  return (
    <Link
      href={href}
      className={className}
      prefetch={shouldPrefetch}
      onMouseEnter={() => prefetchOnHover && setShouldPrefetch(true)}
    >
      {children}
    </Link>
  );
}