import apiClient from './apiClient';
import { Product, CreateProductDto, UpdateProductDto, QueryProductDto, ApiResponse } from '@/types/product';

export const productsApi = {
  // Get all products with pagination and filtering
  getAll: async (query: QueryProductDto = {}): Promise<ApiResponse<Product[]>> => {
    const params = new URLSearchParams();
    
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.search) params.append('search', query.search);
    if (query.minPrice !== undefined) params.append('minPrice', query.minPrice.toString());
    if (query.maxPrice !== undefined) params.append('maxPrice', query.maxPrice.toString());
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);

    const queryString = params.toString();
    return apiClient.get(`/api/products${queryString ? `?${queryString}` : ''}`);
  },

  // Get single product by ID
  getById: async (id: string): Promise<ApiResponse<Product>> => {
    return apiClient.get(`/api/products/${id}`);
  },

  // Create new product
  create: async (data: CreateProductDto): Promise<ApiResponse<Product>> => {
    return apiClient.post('/api/products', data);
  },

  // Update product
  update: async (id: string, data: UpdateProductDto): Promise<ApiResponse<Product>> => {
    return apiClient.patch(`/api/products/${id}`, data);
  },

  // Delete product
  delete: async (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete(`/api/products/${id}`);
  },
};