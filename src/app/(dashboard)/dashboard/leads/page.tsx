"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Mail, Phone, RefreshCw } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { AnimatedDropdownContent } from "@/components/ui/animated-dropdown";

interface Lead {
  id: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  orderNumber: string;
  total: number;
  createdAt: string;
  daysSinceAbandoned: number;
  items: number;
}

export default function LeadsPage() {
  const { formatCurrency } = useCurrency();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendReminder = async (leadId: string) => {
    try {
      await fetch(`/api/leads/${leadId}/reminder`, { method: 'POST' });
      // Could add toast notification here
    } catch (error) {
      console.error('Failed to send reminder:', error);
    }
  };

  const getPriorityBadge = (days: number) => {
    if (days <= 1) return <Badge className="bg-red-100 text-red-800">Hot</Badge>;
    if (days <= 3) return <Badge className="bg-orange-100 text-orange-800">Warm</Badge>;
    return <Badge className="bg-gray-100 text-gray-800">Cold</Badge>;
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex justify-end">
          <Button onClick={fetchLeads} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Abandoned Orders</CardTitle>
                <CardDescription>{filteredLeads.length} potential customers</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Abandoned</TableHead>
                    <TableHead className="w-10">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading leads...
                      </TableCell>
                    </TableRow>
                  ) : filteredLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No abandoned orders found
                      </TableCell>
                    </TableRow>
                  ) : filteredLeads.map((lead, index) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{lead.customerName || 'Unknown'}</div>
                          <div className="text-sm text-muted-foreground">{lead.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{lead.orderNumber}</div>
                          <div className="text-sm text-muted-foreground">{lead.items} items</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(lead.total)}
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(lead.daysSinceAbandoned)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {lead.daysSinceAbandoned} days ago
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </DropdownMenuTrigger>
                          <AnimatedDropdownContent align="end">
                            <DropdownMenuItem onClick={() => handleSendReminder(lead.id)}>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email Reminder
                            </DropdownMenuItem>
                            {lead.customerPhone && (
                              <DropdownMenuItem>
                                <Phone className="mr-2 h-4 w-4" />
                                Call Customer
                              </DropdownMenuItem>
                            )}
                          </AnimatedDropdownContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}