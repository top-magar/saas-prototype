import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Core utility function for merging classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// String utilities
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>"'&]/g, '');
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// CSS utilities
export const cssModules = {
  combine: (moduleClasses: string, tailwindClasses?: string) => {
    return cn(moduleClasses, tailwindClasses);
  },
  conditional: (baseClasses: string, condition: boolean, conditionalClasses: string) => {
    return cn(baseClasses, condition && conditionalClasses);
  },
};

export const themeUtils = {
  getCSSVar: (property: string) => `var(--${property})`,
  colorWithOpacity: (colorVar: string, opacity: number) => 
    `hsl(var(--${colorVar}) / ${opacity})`,
};

// Retry utilities
interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxAttempts = 3, delay = 1000, backoff = true } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }

      const waitTime = backoff ? delay * Math.pow(2, attempt - 1) : delay;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw new Error('Retry operation failed');
}

// Image utilities
export const generateBlurDataURL = (width: number = 8, height: number = 8): string => {
  if (typeof document === 'undefined') return '';
  
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);
  }
  
  return canvas.toDataURL();
};

export const getImageSizes = (breakpoints: Record<string, string>): string => {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => `(max-width: ${breakpoint}) ${size}`)
    .join(', ');
};

export const responsiveSizes = getImageSizes({
  '768px': '100vw',
  '1200px': '50vw',
  '9999px': '33vw'
});