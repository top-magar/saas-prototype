'use client'

import { useActionState } from 'react'
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteProduct } from '@/app/actions/products'

interface DeleteButtonProps {
  productId: string
  productName: string
}

export function DeleteButton({ productId, productName }: DeleteButtonProps) {
  const deleteProductWithId = deleteProduct.bind(null, productId)
  const [state, action, pending] = useActionState(deleteProductWithId, null)

  return (
    <form action={action} className="inline">
      <Button 
        type="submit" 
        variant="ghost" 
        size="sm" 
        disabled={pending}
        className="text-red-600 hover:text-red-700"
      >
        {pending ? (
          'Deleting...'
        ) : (
          <>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </>
        )}
      </Button>
      {state?.error && (
        <span className="text-xs text-red-600 ml-2">{state.error}</span>
      )}
    </form>
  )
}