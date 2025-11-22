"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { PageWrapper } from "@/components/ui/page-wrapper";

interface OrderForm {
  customer: {
    phone: string;
    name: string;
  };
  products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  city: string;
  address: string;
  landmark: string;
  orderNote: string;
  discount: number;
  deliveryCharge: number;
  paymentStatus: string;
}

const mockProducts = [
  { id: "1", name: "Red T-shirt", price: 1500 },
  { id: "2", name: "Blue Jeans", price: 3500 },
  { id: "3", name: "White Sneakers", price: 5000 },
];

export default function CreateOrderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchPhone, setSearchPhone] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [formData, setFormData] = useState<OrderForm>({
    customer: { phone: "", name: "" },
    products: [],
    city: "",
    address: "",
    landmark: "",
    orderNote: "",
    discount: 0,
    deliveryCharge: -1,
    paymentStatus: "Unpaid"
  });

  const handleSubmit = async () => {
    if (!formData.customer.phone || !formData.city || !formData.address) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Order created successfully!");
      router.push("/dashboard/orders");
    } catch (error) {
      toast.error("Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const searchCustomer = () => {
    if (searchPhone) {
      setFormData(prev => ({
        ...prev,
        customer: { phone: searchPhone, name: "John Doe" }
      }));
      toast.success("Customer found!");
    }
  };

  const addProduct = (product: typeof mockProducts[0]) => {
    const exists = formData.products.find(p => p.id === product.id);
    if (exists) {
      setFormData(prev => ({
        ...prev,
        products: prev.products.map(p => 
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        products: [...prev.products, { ...product, quantity: 1 }]
      }));
    }
    setShowProductSearch(false);
    setProductSearch("");
  };

  const removeProduct = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== productId)
    }));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(productId);
      return;
    }
    setFormData(prev => ({
      ...prev,
      products: prev.products.map(p => 
        p.id === productId ? { ...p, quantity } : p
      )
    }));
  };

  const subtotal = formData.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const total = subtotal - formData.discount + (formData.deliveryCharge > 0 ? formData.deliveryCharge : 0);

  return (
    <PageWrapper className="min-h-screen from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Order
            </h1>
            <p className="text-lg text-muted-foreground mt-2">Add a new order to your system</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-8 py-6 border-b">
              <h2 className="text-2xl font-bold text-foreground">Order Information</h2>
              <p className="text-muted-foreground mt-1">Fill in the order details</p>
            </div>

            <div className="p-8 space-y-8">
              {/* Customer Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Customer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search by phone"
                        value={searchPhone}
                        onChange={(e) => setSearchPhone(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={searchCustomer} size="icon">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    {formData.customer.name && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="font-medium">{formData.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{formData.customer.phone}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

              {/* Products Section */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Products ({formData.products.length})</CardTitle>
                      <Button 
                        onClick={() => setShowProductSearch(!showProductSearch)}
                        size="sm"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {showProductSearch && (
                      <div className="space-y-2">
                        <Input
                          placeholder="Search products..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                        />
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {mockProducts
                            .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                            .map(product => (
                            <div
                              key={product.id}
                              className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                              onClick={() => addProduct(product)}
                            >
                              <span>{product.name}</span>
                              <span>NPR {product.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {formData.products.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No products selected</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.products.map(product => (
                          <div key={product.id} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex-1">
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">NPR {product.price}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={product.quantity}
                                onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 0)}
                                className="w-20"
                                min="1"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => removeProduct(product.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

              {/* Delivery Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>City / District *</Label>
                        <Input
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Address *</Label>
                        <Input
                          value={formData.address}
                          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Landmark</Label>
                      <Input
                        value={formData.landmark}
                        onChange={(e) => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Order Note</Label>
                      <Textarea
                        value={formData.orderNote}
                        onChange={(e) => setFormData(prev => ({ ...prev, orderNote: e.target.value }))}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

              {/* Payment & Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment & Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Discount</Label>
                        <Input
                          type="number"
                          value={formData.discount}
                          onChange={(e) => setFormData(prev => ({ ...prev, discount: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Delivery Charge</Label>
                        <Input
                          type="number"
                          value={formData.deliveryCharge}
                          onChange={(e) => setFormData(prev => ({ ...prev, deliveryCharge: parseInt(e.target.value) || -1 }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Status</Label>
                        <Select value={formData.paymentStatus} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentStatus: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Unpaid">Unpaid</SelectItem>
                            <SelectItem value="Paid">Paid</SelectItem>
                            <SelectItem value="Partial">Partial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>NPR {subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span>- NPR {formData.discount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery:</span>
                        <span>{formData.deliveryCharge === -1 ? "Free" : `NPR ${formData.deliveryCharge}`}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>NPR {total}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            </div>

            <div className="bg-gray-50 dark:bg-slate-700/50 px-8 py-6 border-t">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="px-6"
                >
                  Cancel
                </Button>
                
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !formData.customer.phone || !formData.city || !formData.address}
                  className="px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {isSubmitting ? 'Creating...' : 'Create Order'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}