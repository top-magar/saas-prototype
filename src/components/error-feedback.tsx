'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MessageSquare, Send } from 'lucide-react'
import { ErrorLogger } from '@/lib/error-logger'

interface ErrorFeedbackProps {
  error: Error
  onSubmit?: () => void
}

export function ErrorFeedback({ error, onSubmit }: ErrorFeedbackProps) {
  const [open, setOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedback.trim()) return

    setIsSubmitting(true)
    
    try {
      ErrorLogger.logUserFeedback(error, feedback, email)
      setOpen(false)
      setFeedback('')
      setEmail('')
      onSubmit?.()
    } catch (err) {
      console.error('Failed to submit feedback:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          Report Issue
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Error</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="feedback">What happened?</Label>
            <Textarea
              id="feedback"
              placeholder="Describe what you were doing when this error occurred..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isSubmitting || !feedback.trim()}>
            {isSubmitting ? (
              'Sending...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Report
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}