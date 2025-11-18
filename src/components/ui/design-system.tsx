import { cn } from "@/lib/utils";
import { COMPONENT_CLASSES, VARIANTS, createClassName } from "@/lib/design-system";

// Typography Components
export function Heading({ 
  level = 1, 
  className, 
  children, 
  ...props 
}: { 
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const sizeClasses = {
    1: 'text-2xl',
    2: 'text-xl', 
    3: 'text-lg',
    4: 'text-base',
    5: 'text-sm',
    6: 'text-xs'
  };
  
  return (
    <Tag 
      className={cn(COMPONENT_CLASSES.heading, sizeClasses[level], className)} 
      {...props}
    >
      {children}
    </Tag>
  );
}

export function Text({ 
  variant = 'primary',
  size = 'base',
  className, 
  children, 
  ...props 
}: {
  variant?: keyof typeof VARIANTS.text;
  size?: 'xs' | 'sm' | 'base' | 'lg';
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLParagraphElement>) {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg'
  };
  
  return (
    <p 
      className={cn(
        COMPONENT_CLASSES.body, 
        VARIANTS.text[variant], 
        sizeClasses[size], 
        className
      )} 
      {...props}
    >
      {children}
    </p>
  );
}

// Layout Components
export function Container({ 
  className, 
  children, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(COMPONENT_CLASSES.container, className)} {...props}>
      {children}
    </div>
  );
}

export function Section({ 
  className, 
  children, 
  ...props 
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn(COMPONENT_CLASSES.section, className)} {...props}>
      {children}
    </section>
  );
}

export function Grid({ 
  cols = 'auto',
  className, 
  children, 
  ...props 
}: {
  cols?: 'auto' | '2' | '3' | '4';
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const colClasses = {
    auto: 'grid-cols-1',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };
  
  return (
    <div 
      className={cn(COMPONENT_CLASSES.grid, colClasses[cols], className)} 
      {...props}
    >
      {children}
    </div>
  );
}

// Geometric Card Component
export function GeometricCard({ 
  variant = 'default',
  className, 
  children, 
  ...props 
}: {
  variant?: keyof typeof VARIANTS.card;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        COMPONENT_CLASSES.card, 
        VARIANTS.card[variant], 
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}

// Status Indicator
export function StatusIndicator({ 
  status,
  className 
}: {
  status: 'success' | 'warning' | 'error' | 'info';
  className?: string;
}) {
  const colors = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500', 
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };
  
  return (
    <div 
      className={cn(
        'w-2 h-2 border border-border/50', 
        colors[status], 
        className
      )} 
    />
  );
}

// Metric Display
export function Metric({ 
  label, 
  value, 
  change, 
  trend = 'neutral',
  className 
}: {
  label: string;
  value: string;
  change?: string;
  trend?: 'positive' | 'negative' | 'neutral';
  className?: string;
}) {
  const trendColors = {
    positive: 'text-green-600 border-green-200 bg-green-50',
    negative: 'text-red-600 border-red-200 bg-red-50',
    neutral: 'text-muted-foreground border-border bg-muted/50'
  };
  
  return (
    <div className={cn('space-y-2', className)}>
      <Text variant="secondary" size="xs" className="uppercase tracking-wider">
        {label}
      </Text>
      <div className="flex items-center justify-between">
        <Text size="lg" className="font-bold">
          {value}
        </Text>
        {change && (
          <div className={cn(
            'text-xs font-mono px-2 py-1 border',
            trendColors[trend]
          )}>
            {change}
          </div>
        )}
      </div>
    </div>
  );
}