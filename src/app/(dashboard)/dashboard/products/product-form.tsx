'use client'

import { useActionState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { createProduct } from '@/app/actions/products'

interface ProductFormProps {
  onSuccess?: () => void
}

export function ProductForm({ onSuccess }: ProductFormProps) {
  const [state, action, pending] = useActionState(createProduct, null)

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input 
          id="name" 
          name="name" 
          required 
          placeholder="Enter product name"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          placeholder="Enter product description"
        />
      </div>
      
      <div>
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue="DRAFT">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {state?.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {state.message}
            {state.field && (
              <span className="block text-xs mt-1 opacity-75">
                Field: {state.field}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {state?.success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Creating...' : 'Create Product'}
      </Button>
    </form>
  )
}