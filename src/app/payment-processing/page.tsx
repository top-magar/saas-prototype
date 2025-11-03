'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, Clock, ArrowRight, Home, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';

type PaymentStatus = 'processing' | 'success' | 'failed' | 'pending';

export default function PaymentProcessingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus>('processing');
  const [countdown, setCountdown] = useState(5);

  const method = searchParams.get('method') || 'Card';
  const tier = searchParams.get('tier') || 'Pro';
  const amount = searchParams.get('amount') || '999';
  const transactionId = searchParams.get('txn') || `TXN${Date.now()}`;

  // Simulate payment processing
  useEffect(() => {
    const timer = setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      setStatus(success ? 'success' : 'failed');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Countdown for redirect
  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      router.push('/dashboard');
    }
  }, [status, countdown, router]);

  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          icon: <Clock className="h-16 w-16 text-blue-500 animate-pulse" />,
          title: 'Processing Payment...',
          description: 'Please wait while we process your payment securely.',
          color: 'blue'
        };
      case 'success':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          title: 'Payment Successful!',
          description: 'Your subscription has been activated successfully.',
          color: 'green'
        };
      case 'failed':
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: 'Payment Failed',
          description: 'There was an issue processing your payment. Please try again.',
          color: 'red'
        };
      default:
        return {
          icon: <Clock className="h-16 w-16 text-yellow-500" />,
          title: 'Payment Pending',
          description: 'Your payment is being verified.',
          color: 'yellow'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4"
            >
              {config.icon}
            </motion.div>
            <CardTitle className="text-2xl font-bold">{config.title}</CardTitle>
            <p className="text-muted-foreground mt-2">{config.description}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Transaction Details */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Transaction Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Plan</span>
                  <Badge variant="secondary">{tier}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Payment Method</span>
                  <span className="text-sm font-medium">{method}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Amount</span>
                  <span className="text-sm font-bold">NPR {parseInt(amount).toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">Transaction ID</span>
                  <span className="text-xs font-mono bg-background px-2 py-1 rounded">
                    {transactionId}
                  </span>
                </div>
              </div>
            </div>

            {/* Status-specific content */}
            {status === 'processing' && (
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Securely processing your payment...
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center space-y-4">
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Welcome to {tier} plan! You now have access to all premium features.
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Redirecting to dashboard in {countdown} seconds...
                </p>
                <div className="flex gap-3">
                  <Button onClick={() => router.push('/dashboard')} className="flex-1">
                    <Home className="w-4 h-4 mr-2" />
                    Go to Dashboard
                  </Button>
                  <Button variant="outline" onClick={() => window.print()}>
                    <Receipt className="w-4 h-4 mr-2" />
                    Receipt
                  </Button>
                </div>
              </div>
            )}

            {status === 'failed' && (
              <div className="text-center space-y-4">
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    Payment could not be processed. Please check your payment details and try again.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => router.back()} variant="outline" className="flex-1">
                    Try Again
                  </Button>
                  <Button onClick={() => router.push('/dashboard')} className="flex-1">
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                🔒 Your payment is secured with 256-bit SSL encryption
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Support Link */}
        <div className="text-center mt-6">
          <Button variant="link" className="text-muted-foreground">
            Need help? Contact Support
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}