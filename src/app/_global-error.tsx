'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { ErrorLogger } from '@/lib/shared/error-logger'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    ErrorLogger.log(error, { type: 'global', digest: error.digest })
  }, [error])

  return (
    <html>
      <body className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4 p-8 max-w-md">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-red-600">Application Error</h1>
          <p className="text-gray-600">
            Something went wrong with the application. Please try again.
          </p>
          <Button onClick={reset} className="mt-4">
            Try Again
          </Button>
        </div>
      </body>
    </html>
  )
}