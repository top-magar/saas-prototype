'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react';

interface VerificationStatusProps {
  domain: string;
  tenantId: string;
  verificationToken: string;
  onVerified?: () => void;
}

export function VerificationStatus({ 
  domain, 
  tenantId, 
  verificationToken,
  onVerified 
}: VerificationStatusProps) {
  const [status, setStatus] = useState<'pending' | 'verified' | 'checking'>('pending');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [checking, setChecking] = useState(false);

  const checkVerification = async () => {
    setChecking(true);
    setStatus('checking');

    try {
      const response = await fetch('/api/verification/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, domain }),
      });

      const data = await response.json();

      if (data.verified) {
        setStatus('verified');
        setMessage('Domain verified successfully!');
        onVerified?.();
      } else {
        setStatus('pending');
        setMessage(data.message || 'Verification pending');
        setAttempts(data.attempts || 0);
      }
    } catch (error) {
      setStatus('pending');
      setMessage('Failed to check verification. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (status === 'pending' && !checking) {
        checkVerification();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [status, checking]);

  const txtRecord = `_verify-domain.${domain}`;

  return (
    <div className="space-y-4 p-6 border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Domain Verification</h3>
        {status === 'verified' ? (
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        ) : status === 'checking' ? (
          <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
        ) : (
          <Clock className="w-6 h-6 text-yellow-600" />
        )}
      </div>

      {status === 'verified' ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">✓ Domain verified successfully!</p>
          <p className="text-sm text-green-700 mt-1">
            Your domain is now active and ready to use.
          </p>
        </div>
      ) : (
        <>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 font-medium mb-2">
              Add this TXT record to your DNS:
            </p>
            <div className="bg-white p-3 rounded border border-blue-300 font-mono text-sm">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-gray-500">Host:</span>
                  <p className="font-semibold break-all">{txtRecord}</p>
                </div>
                <div>
                  <span className="text-gray-500">Type:</span>
                  <p className="font-semibold">TXT</p>
                </div>
                <div>
                  <span className="text-gray-500">Value:</span>
                  <p className="font-semibold break-all">{verificationToken}</p>
                </div>
              </div>
            </div>
          </div>

          {message && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-900">{message}</p>
                {attempts > 0 && (
                  <p className="text-xs text-yellow-700 mt-1">
                    Verification attempts: {attempts}/10
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-gray-600">
              DNS changes can take up to 48 hours to propagate
            </p>
            <button
              onClick={checkVerification}
              disabled={checking}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {checking ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Check Now
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
