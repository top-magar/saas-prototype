import { sanitizeForLog } from '../security/validation';

export class ErrorLogger {
  static log(error: Error, context?: Record<string, unknown>) {
    const errorData = {
      message: sanitizeForLog(error.message),
      stack: sanitizeForLog(error.stack || ''),
      timestamp: new Date().toISOString(),
      context: context ? this.sanitizeContext(context) : undefined,
      url: typeof window !== 'undefined' ? sanitizeForLog(window.location.href) : undefined,
    }
    
    console.error('Error logged:', JSON.stringify(errorData))
  }
  
  static logServerError(error: Error, context?: Record<string, unknown>) {
    const errorData = {
      message: sanitizeForLog(error.message),
      stack: sanitizeForLog(error.stack || ''),
      timestamp: new Date().toISOString(),
      context: context ? this.sanitizeContext(context) : undefined,
      server: true,
    }
    
    console.error('Server error logged:', JSON.stringify(errorData))
  }
  
  static logUserFeedback(error: Error, feedback: string, userEmail?: string) {
    console.log('User feedback:', JSON.stringify({ 
      error: sanitizeForLog(error.message), 
      feedback: sanitizeForLog(feedback), 
      userEmail: sanitizeForLog(userEmail || '') 
    }))
  }

  private static sanitizeContext(context: Record<string, unknown>): Record<string, string> {
    const sanitized: Record<string, string> = {};
    for (const [key, value] of Object.entries(context)) {
      sanitized[sanitizeForLog(key)] = sanitizeForLog(value);
    }
    return sanitized;
  }
}