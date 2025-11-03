'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AddProductPage() {
  const router = useRouter();
  const [availability, setAvailability] = useState('in-stock');
  const [features, setFeatures] = useState({
    featured: false,
    newArrival: false,
    onSale: false,
    exclusive: false,
  });
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');

  const handleCreateProduct = () => {
    if (!productName.trim()) {
      toast.error('Please enter a product name');
      return;
    }
    if (!category) {
      toast.error('Please select a category');
      return;
    }
    
    toast.success('Product created successfully!');
    router.push('/dashboard/products');
  };

  const handleCancel = () => {
    router.push('/dashboard/products');
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/products">
            <Button size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Create Product Listing</h1>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Add your product details below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">Product Name</Label>
              <Input
                id="product-name"
                placeholder="Enter product name"
                className="max-w-md"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-category">Product Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="max-w-md">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Availability</Label>
              <RadioGroup value={availability} onValueChange={setAvailability} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in-stock" id="in-stock" />
                  <Label htmlFor="in-stock">In Stock</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pre-order" id="pre-order" />
                  <Label htmlFor="pre-order">Pre-order</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="backorder" id="backorder" />
                  <Label htmlFor="backorder">Backorder</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Product Media */}
        <Card>
          <CardHeader>
            <CardTitle>Product Media</CardTitle>
            <CardDescription>Add product images and media.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Product Images</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="text-lg font-medium text-gray-600 mb-2">
                  <span className="text-blue-600 cursor-pointer hover:underline">Click to upload</span> or drag and drop
                </div>
                <div className="text-sm text-gray-500">
                  PNG, JPG or GIF (MAX. 800×400px)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Options */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Options</CardTitle>
            <CardDescription>Configure additional product options.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Label className="text-base font-medium">Features</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={features.featured}
                    onCheckedChange={(checked) =>
                      setFeatures(prev => ({ ...prev, featured: checked as boolean }))
                    }
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="on-sale"
                    checked={features.onSale}
                    onCheckedChange={(checked) =>
                      setFeatures(prev => ({ ...prev, onSale: checked as boolean }))
                    }
                  />
                  <Label htmlFor="on-sale">On Sale</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="new-arrival"
                    checked={features.newArrival}
                    onCheckedChange={(checked) =>
                      setFeatures(prev => ({ ...prev, newArrival: checked as boolean }))
                    }
                  />
                  <Label htmlFor="new-arrival">New Arrival</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="exclusive"
                    checked={features.exclusive}
                    onCheckedChange={(checked) =>
                      setFeatures(prev => ({ ...prev, exclusive: checked as boolean }))
                    }
                  />
                  <Label htmlFor="exclusive">Exclusive</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleCreateProduct}>Create Product</Button>
        </div>
      </div>
    </div>
  );
}