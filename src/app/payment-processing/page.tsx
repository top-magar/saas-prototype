'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

export default function PaymentProcessingPage() {
  const searchParams = useSearchParams();
  const method = searchParams.get('method');
  const tier = searchParams.get('tier');
  const status = searchParams.get('status'); // Optional: for actual success/failure

  const isSuccess = status === 'success';

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          {isSuccess ? (
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          ) : (
            <XCircle className="mx-auto h-16 w-16 text-yellow-500" />
          )}
          <CardTitle className="mt-4 text-xl">
            {isSuccess ? 'Payment Successful!' : 'Payment Processing...'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your payment for the {tier || 'selected'} plan via {method || 'unknown'} is being processed.
          </p>
          {!isSuccess && (
            <p className="text-sm text-muted-foreground">
              Please do not close this window. You will be redirected shortly, or your dashboard will be updated.
            </p>
          )}
          {isSuccess && (
            <p className="text-sm text-muted-foreground">
              Your subscription has been updated. You can now access your new features.
            </p>
          )}
          {/* In a real application, you might have a spinner or more detailed status here */}
        </CardContent>
      </Card>
    </div>
  );
}