// src/lib/mock-data.ts

export const kpiData = {
  totalSales: { value: 12485, change: 3.1, changeType: 'increase' },
  totalRevenue: { value: 68837, change: 2.4, changeType: 'increase' },
  activeCustomers: { value: 4263, change: 1.8, changeType: 'increase' },
  refundRequests: { value: 187, change: -0.8, changeType: 'decrease' },
};

export const totalProfitData = [
  { month: 'May', totalSales: 45000, totalRevenue: 65000 },
  { month: 'Jun', totalSales: 52000, totalRevenue: 72000 },
  { month: 'Jul', totalSales: 68000, totalRevenue: 88000 },
  { month: 'Aug', totalSales: 60000, totalRevenue: 80000 },
  { month: 'Sep', totalSales: 88732, totalRevenue: 72490, label: 'August 2025' },
  { month: 'Oct', totalSales: 75000, totalRevenue: 95000 },
  { month: 'Nov', totalSales: 82000, totalRevenue: 102000 },
  { month: 'Dec', totalSales: 95000, totalRevenue: 115000 },
];

export const successRateData = [
  { name: 'Sales Growth', value: 72.5, fill: 'hsl(var(--primary))' },
];

export const recentOrdersData = [
    { id: '#10248', product: 'Smartwatch Pro X', customer: 'Shakil Ahmed', date: '21 Jan 2025', payment: 'Mastercard', amount: 299.00, status: 'Completed' },
    { id: '#10246', product: 'Office Chair Deluxe', customer: 'Arafat Hossain', date: '21 Jan 2025', payment: 'Visa', amount: 450.50, status: 'Pending' },
    { id: '#10247', product: 'Laptop Stand Ergonomic', customer: 'Nusrat Jahan', date: '22 Jan 2025', payment: 'PayPal', amount: 65.50, status: 'Completed' },
    { id: '#10245', product: 'Wireless Earbuds Max', customer: 'Tania Akter', date: '22 Jan 2025', payment: 'Mastercard', amount: 120.00, status: 'Cancelled' },
];

export const topProductsData = [
    { name: 'EcoBottle Smart Flask', percent: 40, earnings: 27000 },
    { name: 'ZERO Wireless Earbuds', percent: 35, earnings: 23800 },
    { name: 'ErgoFlex Standing Desk', percent: 25, earnings: 16800 },
];