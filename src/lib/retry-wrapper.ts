import { ErrorLogger } from './error-logger'

interface RetryOptions {
  maxAttempts?: number
  delay?: number
  backoff?: boolean
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxAttempts = 3, delay = 1000, backoff = true } = options

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      const err = error as Error
      
      ErrorLogger.logServerError(err, {
        retryAttempt: attempt,
        maxAttempts,
        operation: operation.name || 'anonymous'
      })

      if (attempt === maxAttempts) {
        throw err
      }

      // Wait before retrying with exponential backoff
      const waitTime = backoff ? delay * Math.pow(2, attempt - 1) : delay
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }

  throw new Error('Retry operation failed')
}