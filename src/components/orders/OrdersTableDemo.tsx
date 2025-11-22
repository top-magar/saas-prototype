"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronUp, Search, MoreHorizontal, Download, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

interface Order {
    id: string
    orderNumber: string
    customer: string
    email: string
    amount: number
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
    date: string
    items: number
}

// Sample data
const SAMPLE_ORDERS: Order[] = [
    {
        id: "1",
        orderNumber: "ORD-2024-001",
        customer: "John Smith",
        email: "john@example.com",
        amount: 1250.5,
        status: "delivered",
        date: "2024-12-20",
        items: 3,
    },
    {
        id: "2",
        orderNumber: "ORD-2024-002",
        customer: "Sarah Johnson",
        email: "sarah@example.com",
        amount: 890.25,
        status: "shipped",
        date: "2024-12-19",
        items: 2,
    },
    {
        id: "3",
        orderNumber: "ORD-2024-003",
        customer: "Michael Chen",
        email: "michael@example.com",
        amount: 2150.0,
        status: "processing",
        date: "2024-12-18",
        items: 5,
    },
    {
        id: "4",
        orderNumber: "ORD-2024-004",
        customer: "Emma Williams",
        email: "emma@example.com",
        amount: 645.75,
        status: "pending",
        date: "2024-12-17",
        items: 1,
    },
    {
        id: "5",
        orderNumber: "ORD-2024-005",
        customer: "David Brown",
        email: "david@example.com",
        amount: 3200.0,
        status: "delivered",
        date: "2024-12-16",
        items: 8,
    },
    {
        id: "6",
        orderNumber: "ORD-2024-006",
        customer: "Lisa Anderson",
        email: "lisa@example.com",
        amount: 525.5,
        status: "cancelled",
        date: "2024-12-15",
        items: 2,
    },
    {
        id: "7",
        orderNumber: "ORD-2024-007",
        customer: "James Martinez",
        email: "james@example.com",
        amount: 1875.25,
        status: "shipped",
        date: "2024-12-14",
        items: 4,
    },
    {
        id: "8",
        orderNumber: "ORD-2024-008",
        customer: "Rachel Green",
        email: "rachel@example.com",
        amount: 980.0,
        status: "processing",
        date: "2024-12-13",
        items: 3,
    },
]

type SortField = "orderNumber" | "amount" | "date" | "customer"
type SortDirection = "asc" | "desc"

const statusConfig = {
    pending: {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    },
    processing: {
        label: "Processing",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    shipped: {
        label: "Shipped",
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
    delivered: {
        label: "Delivered",
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    cancelled: {
        label: "Cancelled",
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
}

export default function OrdersTableDemo() {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [sortField, setSortField] = useState<SortField>("date")
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
    const [itemsPerPage] = useState(5)
    const [currentPage, setCurrentPage] = useState(1)

    // Filter and search
    const filteredOrders = useMemo(() => {
        const result = SAMPLE_ORDERS.filter((order) => {
            const matchesSearch =
                order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.email.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesStatus = statusFilter === "all" || order.status === statusFilter

            return matchesSearch && matchesStatus
        })

        // Sort
        result.sort((a, b) => {
            let aValue: string | number
            let bValue: string | number

            switch (sortField) {
                case "amount":
                    aValue = a.amount
                    bValue = b.amount
                    break
                case "date":
                    aValue = new Date(a.date).getTime()
                    bValue = new Date(b.date).getTime()
                    break
                case "customer":
                    aValue = a.customer.toLowerCase()
                    bValue = b.customer.toLowerCase()
                    break
                default:
                    aValue = a.orderNumber
                    bValue = b.orderNumber
            }

            if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
            if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
            return 0
        })

        return result
    }, [searchQuery, statusFilter, sortField, sortDirection])

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("desc")
        }
    }

    const SortHeader = ({
        field,
        children,
    }: {
        field: SortField
        children: React.ReactNode
    }) => (
        <TableHead onClick={() => handleSort(field)} className="cursor-pointer select-none hover:bg-muted/50">
            <div className="flex items-center gap-2">
                {children}
                {sortField === field && (
                    <>{sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</>
                )}
            </div>
        </TableHead>
    )

    return (
        <div className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1 lg:max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search orders..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setCurrentPage(1)
                        }}
                    />
                </div>

                {/* Stacked buttons on mobile, row on tablet+ */}
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-40">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="sm" className="gap-2 bg-transparent w-full sm:w-auto">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Table - Hidden on mobile, card view on mobile */}
            <div className="rounded-lg border border-border overflow-x-auto bg-card">
                <div className="hidden md:block">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                <SortHeader field="orderNumber">Order ID</SortHeader>
                                <SortHeader field="customer">Customer</SortHeader>
                                <SortHeader field="amount">Amount</SortHeader>
                                <TableHead>Status</TableHead>
                                <SortHeader field="date">Date</SortHeader>
                                <TableHead className="text-right">Items</TableHead>
                                <TableHead className="w-10"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedOrders.length > 0 ? (
                                paginatedOrders.map((order) => (
                                    <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                                        <TableCell className="font-medium text-foreground">{order.orderNumber}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-foreground">{order.customer}</p>
                                                <p className="text-sm text-muted-foreground">{order.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-foreground">${order.amount.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <span
                                                className={cn(
                                                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                    statusConfig[order.status].color,
                                                )}
                                            >
                                                {statusConfig[order.status].label}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{new Date(order.date).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right text-foreground">{order.items}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Open menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem>Edit Order</DropdownMenuItem>
                                                    <DropdownMenuItem>Send Invoice</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No orders found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile card view for better UX on small screens */}
                <div className="md:hidden">
                    {paginatedOrders.length > 0 ? (
                        <div className="divide-y divide-border">
                            {paginatedOrders.map((order) => (
                                <div key={order.id} className="p-4 space-y-3 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-semibold text-foreground">{order.orderNumber}</p>
                                            <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem>Edit Order</DropdownMenuItem>
                                                <DropdownMenuItem>Send Invoice</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Customer</span>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-foreground">{order.customer}</p>
                                                <p className="text-xs text-muted-foreground">{order.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Amount</span>
                                            <p className="text-sm font-semibold text-foreground">${order.amount.toFixed(2)}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Items</span>
                                            <p className="text-sm font-medium text-foreground">{order.items}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Status</span>
                                            <span
                                                className={cn(
                                                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                    statusConfig[order.status].color,
                                                )}
                                            >
                                                {statusConfig[order.status].label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">No orders found</div>
                    )}
                </div>
            </div>

            {/* Pagination - Improved for mobile */}
            {totalPages > 1 && (
                <div className="flex flex-col gap-4 items-center justify-between md:flex-row">
                    <p className="text-sm text-muted-foreground text-center md:text-left">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                        {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                    </p>
                    <div className="flex gap-1 flex-wrap justify-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                            return page <= totalPages ? (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className="w-10 h-10 p-0"
                                >
                                    {page}
                                </Button>
                            ) : null
                        })}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                            <span className="px-2 py-1 text-muted-foreground">...</span>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Summary Stats - Grid adjusted for mobile */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{filteredOrders.length}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                        ${filteredOrders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}
                    </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Pending Orders</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                        {filteredOrders.filter((o) => o.status === "pending").length}
                    </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Delivered Orders</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                        {filteredOrders.filter((o) => o.status === "delivered").length}
                    </p>
                </div>
            </div>
        </div>
    )
}
