'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Mail } from 'lucide-react';

import { Suspense } from 'react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const success = searchParams.get('success');
  const error = searchParams.get('error');
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      toast.success('Verification email sent!');
    } catch {
      toast.error('Failed to resend email');
    } finally {
      setResending(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="text-2xl font-bold">Email Verified!</h1>
          <p className="text-muted-foreground">Your email has been successfully verified. You can now log in.</p>
          <Button asChild className="w-full">
            <Link href="/sign-in">Go to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6 text-center">
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
          <h1 className="text-2xl font-bold">Verification Failed</h1>
          <p className="text-muted-foreground">
            {error === 'invalid' ? 'Invalid or expired verification link.' : 'Something went wrong.'}
          </p>
          <Button asChild className="w-full">
            <Link href="/sign-up">Sign Up Again</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <Mail className="mx-auto h-16 w-16 text-primary" />
        <h1 className="text-2xl font-bold">Check Your Email</h1>
        <p className="text-muted-foreground">
          We've sent a verification link to <strong>{email}</strong>. Click the link to verify your account.
        </p>
        <div className="space-y-3">
          <Button onClick={handleResend} disabled={resending} variant="outline" className="w-full">
            {resending ? 'Sending...' : 'Resend Verification Email'}
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/sign-in">Back to Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
