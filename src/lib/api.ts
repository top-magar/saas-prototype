import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Category API
export const getCategories = (tenantId: string) => 
  api.get(`/products/categories?tenantId=${tenantId}`);

export const deleteCategory = (tenantId: string, categoryId: string) => 
  api.delete(`/products/categories?tenantId=${tenantId}&categoryId=${categoryId}`);

export const updateCategory = (tenantId: string, categoryId: string, data: Record<string, unknown>) => 
  api.patch(`/products/categories?tenantId=${tenantId}&categoryId=${categoryId}`, data);

export const createCategory = (tenantId: string, data: Record<string, unknown>) => 
  api.post(`/products/categories?tenantId=${tenantId}`, data);

// Product API
export const getProducts = (tenantId: string, searchTerm: string, categoryId: string) => 
  api.get(`/products?tenantId=${tenantId}&searchTerm=${searchTerm}&categoryId=${categoryId}`);

export const deleteProduct = (tenantId: string, productId: string) => 
  api.delete(`/products?tenantId=${tenantId}&productId=${productId}`);

export const bulkDeleteProducts = (tenantId: string, productIds: string[]) => 
  api.delete(`/products/bulk`, { data: { tenantId, productIds } });

export const createProduct = (tenantId: string, data: Record<string, unknown>) => 
  api.post(`/products?tenantId=${tenantId}`, data);

export const updateProduct = (tenantId: string, productId: string, data: Record<string, unknown>) => 
  api.put(`/products?tenantId=${tenantId}&productId=${productId}`, data);

export default api;