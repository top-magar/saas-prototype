"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AnimatedDropdownContent } from "@/components/ui/animated-dropdown";
import { motion } from "framer-motion";
import { DatePicker } from "@/components/ui/date-picker";
import { PageTransition } from "@/components/ui/page-transition";
import { Search, Plus, MoreVertical, Edit2, Trash2, Copy } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  minAmount?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed" | "free_shipping",
    value: "",
    minAmount: "",
    maxUses: "",
    expiresAt: ""
  });
  const [expiryDate, setExpiryDate] = useState<Date>();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/coupons');
      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      }
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCoupon ? `/api/coupons/${editingCoupon.id}` : '/api/coupons';
      const method = editingCoupon ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          value: formData.type === 'free_shipping' ? 0 : Number(formData.value),
          minAmount: formData.minAmount ? Number(formData.minAmount) : undefined,
          maxUses: formData.maxUses ? Number(formData.maxUses) : undefined,
          expiresAt: expiryDate ? expiryDate.toISOString() : undefined
        })
      });

      if (response.ok) {
        fetchCoupons();
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save coupon:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchCoupons();
      }
    } catch (error) {
      console.error('Failed to delete coupon:', error);
    }
  };

  const resetForm = () => {
    setFormData({ code: "", type: "percentage", value: "", minAmount: "", maxUses: "", expiresAt: "" });
    setExpiryDate(undefined);
    setShowCreateDialog(false);
    setEditingCoupon(null);
  };

  const handleEdit = (coupon: Coupon) => {
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.type === 'free_shipping' ? '0' : coupon.value.toString(),
      minAmount: coupon.minAmount?.toString() || "",
      maxUses: coupon.maxUses?.toString() || "",
      expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : ""
    });
    setExpiryDate(coupon.expiresAt ? new Date(coupon.expiresAt) : undefined);
    setEditingCoupon(coupon);
    setShowCreateDialog(true);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const getStatusBadge = (coupon: Coupon) => {
    if (!coupon.isActive) return <Badge variant="secondary">Inactive</Badge>;
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return <Badge variant="destructive">Expired</Badge>;
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return <Badge variant="destructive">Used Up</Badge>;
    return <Badge className="bg-green-100 text-green-800">Active</Badge>;
  };

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex justify-end">
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coupons</CardTitle>
          <CardDescription>{filteredCoupons.length} discount codes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search coupons..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="w-10">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">Loading coupons...</TableCell>
                  </TableRow>
                ) : filteredCoupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">No coupons found</TableCell>
                  </TableRow>
                ) : filteredCoupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="font-mono font-bold">{coupon.code}</code>
                        <Button variant="ghost" size="sm" onClick={() => copyCode(coupon.code)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {coupon.type === 'percentage' ? `${coupon.value}%` : 
                       coupon.type === 'free_shipping' ? 'Free Shipping' : `$${coupon.value}`}
                      {coupon.minAmount && <div className="text-xs text-muted-foreground">Min: ${coupon.minAmount}</div>}
                    </TableCell>
                    <TableCell>
                      {coupon.usedCount}{coupon.maxUses ? `/${coupon.maxUses}` : ''}
                    </TableCell>
                    <TableCell>{getStatusBadge(coupon)}</TableCell>
                    <TableCell className="text-sm">
                      {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </DropdownMenuTrigger>
                        <AnimatedDropdownContent align="end">
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 }}
                          >
                            <DropdownMenuItem onClick={() => handleEdit(coupon)}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <DropdownMenuItem onClick={() => handleDelete(coupon.id)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </motion.div>
                        </AnimatedDropdownContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="code">Coupon Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="SAVE20"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => {
                  const newType = value as "percentage" | "fixed" | "free_shipping";
                  setFormData(prev => ({ 
                    ...prev, 
                    type: newType,
                    value: newType === 'free_shipping' ? '0' : prev.value
                  }));
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="free_shipping">Free Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="value">{formData.type === 'free_shipping' ? 'Shipping Discount' : 'Value'} *</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  placeholder={formData.type === 'percentage' ? '20' : formData.type === 'free_shipping' ? '0' : '10'}
                  required={formData.type !== 'free_shipping'}
                  disabled={formData.type === 'free_shipping'}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minAmount">Min Order Amount</Label>
                <Input
                  id="minAmount"
                  type="number"
                  value={formData.minAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, minAmount: e.target.value }))}
                  placeholder="50"
                />
              </div>
              <div>
                <Label htmlFor="maxUses">Max Uses</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxUses: e.target.value }))}
                  placeholder="100"
                />
              </div>
            </div>
            <div>
              <Label>Expiry Date</Label>
              <DatePicker
                date={expiryDate}
                onSelect={setExpiryDate}
                placeholder="Pick expiry date"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit">{editingCoupon ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      </div>
    </PageTransition>
  );
}