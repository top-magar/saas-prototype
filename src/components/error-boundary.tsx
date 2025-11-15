'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { ErrorLogger } from '@/lib/shared/error-logger'
import { ErrorFeedback } from './error-feedback'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  enableRetry?: boolean
  enableFeedback?: boolean
}

interface State {
  hasError: boolean
  error?: Error
  retryCount: number
}

export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, retryCount: 0 }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, retryCount: 0 }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    ErrorLogger.log(error, { 
      errorInfo, 
      component: 'ErrorBoundary',
      retryCount: this.state.retryCount
    })
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        retryCount: prevState.retryCount + 1
      }))
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const canRetry = this.props.enableRetry !== false && this.state.retryCount < this.maxRetries
      
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center p-8 space-y-4 border rounded-lg bg-red-50">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <h3 className="text-lg font-semibold">Something went wrong</h3>
          <p className="text-muted-foreground text-center">
            This component encountered an error. 
            {canRetry ? 'You can try again or report the issue.' : 'Please refresh the page or report the issue.'}
          </p>
          
          {this.state.retryCount > 0 && (
            <p className="text-xs text-muted-foreground">
              Retry attempt: {this.state.retryCount}/{this.maxRetries}
            </p>
          )}
          
          <div className="flex gap-2">
            {canRetry && (
              <Button onClick={this.handleRetry} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            
            {this.props.enableFeedback !== false && (
              <ErrorFeedback 
                error={this.state.error}
                onSubmit={() => console.log('Feedback submitted')}
              />
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}