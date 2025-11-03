interface RetryOptions {
  maxAttempts: number
  delay: number
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === options.maxAttempts) {
        throw lastError
      }
      
      await new Promise(resolve => setTimeout(resolve, options.delay))
    }
  }
  
  throw lastError!
}