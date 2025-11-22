'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { productService } from '@/lib/services/product.service'
import { ErrorLogger } from '@/lib/shared/error-logger'
import { withRetry } from '@/lib/utils'

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
})

export async function createProduct(formData: FormData) {
  const session = await getServerSession(authOptions)
  const user = session?.user
  if (!user) {
    throw new Error('Unauthorized. Please sign in.')
  }

  const tenantId = ((user as any)?.publicMetadata?.tenantId as string) ||
    ((user as any)?.privateMetadata?.tenantId as string) ||
    (user as any)?.id

  const rawData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    status: (formData.get('status') as "DRAFT" | "PUBLISHED" | "ARCHIVED") || "DRAFT"
  }

  try {
    const validatedData = productSchema.parse(rawData)

    await withRetry(() => productService.createProduct({
      tenantId,
      userId: (user as any).id,
      ...validatedData,
    }), { maxAttempts: 2, delay: 500 })

    revalidatePath('/dashboard/products')
  } catch (error) {
    ErrorLogger.logServerError(error as Error, {
      action: 'createProduct',
      tenantId,
      userId: (user as any).id
    })

    if (error instanceof z.ZodError) {
      throw new Error(error.issues[0].message)
    }

    throw new Error('Failed to create product. Please try again.')
  }

  redirect('/dashboard/products')
}

export async function updateProduct(productId: string, formData: FormData) {
  const session = await getServerSession(authOptions)
  const user = session?.user
  if (!user) {
    return { error: 'Unauthorized. Please sign in.' }
  }

  const tenantId = ((user as any)?.publicMetadata?.tenantId as string) ||
    ((user as any)?.privateMetadata?.tenantId as string) ||
    (user as any)?.id

  const rawData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    status: formData.get('status') as "DRAFT" | "PUBLISHED" | "ARCHIVED"
  }

  try {
    const validatedData = productSchema.partial().parse(rawData)

    await withRetry(() => productService.updateProduct(productId, {
      tenantId,
      userId: (user as any).id,
      ...validatedData,
    }), { maxAttempts: 2, delay: 500 })

    revalidatePath('/dashboard/products')
    return { success: true, message: 'Product updated successfully' }
  } catch (error) {
    ErrorLogger.logServerError(error as Error, {
      action: 'updateProduct',
      productId,
      tenantId,
      userId: (user as any).id
    })

    if (error instanceof z.ZodError) {
      return {
        error: true,
        message: error.issues[0].message,
        field: error.issues[0].path[0] as string
      }
    }

    return { error: true, message: 'Failed to update product. Please try again.' }
  }
}

export async function deleteProduct(productId: string) {
  const session = await getServerSession(authOptions)
  const user = session?.user
  if (!user) {
    return { error: 'Unauthorized. Please sign in.' }
  }

  const tenantId = ((user as any)?.publicMetadata?.tenantId as string) ||
    ((user as any)?.privateMetadata?.tenantId as string) ||
    (user as any)?.id

  try {
    await withRetry(() => productService.deleteProduct(productId, tenantId, (user as any).id), { maxAttempts: 2, delay: 500 })
    revalidatePath('/dashboard/products')
    return { success: true, message: 'Product deleted successfully' }
  } catch (error) {
    ErrorLogger.logServerError(error as Error, {
      action: 'deleteProduct',
      productId,
      tenantId,
      userId: (user as any).id
    })

    return { error: true, message: 'Failed to delete product. Please try again.' }
  }
}