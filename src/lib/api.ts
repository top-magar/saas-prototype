import axios from 'axios';

// Define a generic API function to handle requests and errors
const api = axios.create({
  baseURL: '/api',
});

export const getCategories = (tenantId: string) => {
  return api.get(`/products/categories?tenantId=${tenantId}`);
};

export const deleteCategory = (tenantId: string, categoryId: string) => {
  return api.delete(`/products/categories?tenantId=${tenantId}&categoryId=${categoryId}`);
};

export const updateCategory = (tenantId: string, categoryId: string, data: any) => {
  return api.patch(`/products/categories?tenantId=${tenantId}&categoryId=${categoryId}`, data);
};

export const createCategory = (tenantId: string, data: any) => {
  return api.post(`/products/categories?tenantId=${tenantId}`, data);
};

export const getProducts = (tenantId: string, searchTerm: string, categoryId: string) => {
  return api.get(`/products?tenantId=${tenantId}&searchTerm=${searchTerm}&categoryId=${categoryId}`);
};

export const deleteProduct = (tenantId: string, productId: string) => {
  return api.delete(`/products?tenantId=${tenantId}&productId=${productId}`);
};

export const bulkDeleteProducts = (tenantId: string, productIds: string[]) => {
  return api.delete(`/products/bulk`, { data: { tenantId, productIds } });
};

export const createProduct = (tenantId: string, data: any) => {
    return api.post(`/products?tenantId=${tenantId}`, data);
};

export const updateProduct = (tenantId: string, productId: string, data: any) => {
    return api.put(`/products?tenantId=${tenantId}&productId=${productId}`, data);
};

export default api;