import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createProduct } from '@/app/actions/products'

export default function CreateProductPage() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <h1 className="text-xl font-semibold md:text-2xl">Create Product</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            Create a new product. This form works without JavaScript.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createProduct} className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
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
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <select 
                id="status" 
                name="status" 
                defaultValue="DRAFT"
                className="w-full p-2 border rounded-md"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button type="submit">Create Product</Button>
              <Link href="/dashboard/products">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}