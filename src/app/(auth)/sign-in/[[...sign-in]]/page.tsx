import { LoginForm } from "@/components/login-form";

export default function SignInPage() {
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
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="bg-muted relative hidden lg:block" role="complementary" aria-label="Login page information">
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="max-w-md space-y-6 text-center">
            <h2 className="text-3xl font-bold">Your Business, Simplified</h2>
            <p className="text-lg text-muted-foreground">
              Manage your inventory, track sales, and grow your business with our powerful SaaS platform.
            </p>
            <div className="flex items-center justify-center gap-8 pt-8">
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}