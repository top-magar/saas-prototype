import * as Sentry from '@sentry/nextjs'

export class ErrorLogger {
  static log(error: Error, context?: Record<string, unknown>) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', JSON.stringify(errorData))
    }
    
    // Send to Sentry in production
    if (process.env.NODE_ENV === 'production') {
      Sentry.withScope((scope) => {
        if (context) {
          Object.keys(context).forEach(key => {
            scope.setContext(key, context[key])
          })
        }
        scope.setLevel('error')
        Sentry.captureException(error)
      })
    }
  }
  
  static logServerError(error: Error, context?: Record<string, unknown>) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
      server: true,
    }
    
    console.error('Server error logged:', JSON.stringify(errorData))
    
    // Send to Sentry
    if (process.env.NODE_ENV === 'production') {
      Sentry.withScope((scope) => {
        scope.setTag('server', true)
        if (context) {
          Object.keys(context).forEach(key => {
            scope.setContext(key, context[key])
          })
        }
        scope.setLevel('error')
        Sentry.captureException(error)
      })
    }
  }
  
  static logUserFeedback(error: Error, feedback: string, userEmail?: string) {
    if (process.env.NODE_ENV === 'production') {
      const eventId = Sentry.captureException(error)
      
      Sentry.captureFeedback({
        message: feedback,
        name: userEmail || 'Anonymous',
        email: userEmail || 'anonymous@example.com',
        associatedEventId: eventId,
      })
    }
    
    console.log('User feedback:', JSON.stringify({ error: error.message, feedback, userEmail }))
  }
}