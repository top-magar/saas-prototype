export class ErrorLogger {
  static log(error: Error, context?: Record<string, unknown>) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    }
    
    console.error('Error logged:', JSON.stringify(errorData))
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
  }
  
  static logUserFeedback(error: Error, feedback: string, userEmail?: string) {
    console.log('User feedback:', JSON.stringify({ error: error.message, feedback, userEmail }))
  }
}