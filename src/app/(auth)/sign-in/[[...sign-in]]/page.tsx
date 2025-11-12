'use client';
 
import { SignIn } from "@clerk/nextjs";
 
export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="mx-auto w-full max-w-xs space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto h-16 w-16 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground">P</span>
          </div>
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to access your dashboard, settings and projects.
          </p>
        </div>
        <div className="flex justify-center">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "w-full justify-center gap-2",
                formButtonPrimary: "w-full bg-primary hover:bg-primary/90",
                footerActionLink: "text-primary hover:text-primary/80"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}