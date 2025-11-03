'use client';
 
import { SignUp } from "@clerk/nextjs";
 
export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <SignUp
        appearance={{
          elements: {
            afterSignUpForm: `
              <div class="cl-formField">
                <label for="companyName" class="cl-formFieldLabel">Organization Name</label>
                <input type="text" id="companyName" name="companyName" class="cl-formFieldInput" placeholder="Your Organization Name" required />
              </div>
              <div class="cl-formField">
                <label for="subdomain" class="cl-formFieldLabel">Subdomain</label>
                <input type="text" id="subdomain" name="subdomain" class="cl-formFieldInput" placeholder="your-subdomain" required />
              </div>
            `,
          },
        }}
      />
    </div>
  );
}