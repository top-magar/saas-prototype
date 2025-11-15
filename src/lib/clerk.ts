import { Clerk } from '@clerk/clerk-js';

// Initialize Clerk with custom configuration
export const initializeClerk = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    const clerk = new Clerk(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
    
    // Load Clerk with increased timeout
    clerk.load({
      // Increase timeout to 30 seconds
      timeout: 30000,
    }).catch((error) => {
      console.error('Failed to load Clerk:', error);
    });
    
    return clerk;
  }
  return null;
};