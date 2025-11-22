import { SignUpForm } from "@/components/signup-form";

export default function SignUpPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left Column */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
                aria-label="Pasaal.io logo"
                role="img"
              >
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                <path d="M12 3v6" />
              </svg>
            </div>
            Pasaal.io
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <SignUpForm />
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="bg-muted relative hidden lg:block" role="complementary" aria-label="Sign up page information">
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="max-w-md space-y-6 text-center">
            <h2 className="text-3xl font-bold">Join thousands of businesses</h2>
            <p className="text-lg text-muted-foreground">
              Start your journey with Pasaal.io and experience the future of business management.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 justify-center">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <svg className="size-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Easy to use</h3>
                  <p className="text-sm text-muted-foreground">Intuitive interface designed for everyone</p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <svg className="size-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Secure & reliable</h3>
                  <p className="text-sm text-muted-foreground">Your data is protected with enterprise-grade security</p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <svg className="size-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Free trial</h3>
                  <p className="text-sm text-muted-foreground">Start with 14 days free, no credit card required</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}