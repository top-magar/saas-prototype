'use client'

import { useState, useCallback } from 'react'
import { ErrorLogger } from '@/lib/error-logger'

interface RetryOptions {
  maxAttempts?: number
  delay?: number
  backoff?: boolean
}

export function useRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
) {
  const { maxAttempts = 3, delay = 1000, backoff = true } = options
  const [isRetrying, setIsRetrying] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [lastError, setLastError] = useState<Error | null>(null)

  const retry = useCallback(async (): Promise<T> => {
    setIsRetrying(true)
    setLastError(null)

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        setAttempts(attempt)
        const result = await operation()
        setIsRetrying(false)
        setAttempts(0)
        return result
      } catch (error) {
        const err = error as Error
        setLastError(err)
        
        ErrorLogger.log(err, { 
          retryAttempt: attempt, 
          maxAttempts,
          operation: operation.name || 'anonymous'
        })

        if (attempt === maxAttempts) {
          setIsRetrying(false)
          throw err
        }

        // Wait before retrying with exponential backoff
        const waitTime = backoff ? delay * Math.pow(2, attempt - 1) : delay
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }

    setIsRetrying(false)
    throw lastError
  }, [operation, maxAttempts, delay, backoff, lastError])

  const reset = useCallback(() => {
    setIsRetrying(false)
    setAttempts(0)
    setLastError(null)
  }, [])

  return {
    retry,
    reset,
    isRetrying,
    attempts,
    lastError,
    canRetry: attempts < maxAttempts && !isRetrying
  }
}