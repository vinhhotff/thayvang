import apiClient from '../apiClient';

export interface CartItem {
  productId: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
  };
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export const cartApi = {
  // Get user cart
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get('/cart');
    return response.data || response;
  },

  // Add item to cart
  addToCart: async (data: AddToCartDto): Promise<Cart> => {
    const response = await apiClient.post('/cart', data);
    return response.data || response;
  },

  // Update cart item quantity
  updateCartItem: async (productId: string, data: UpdateCartItemDto): Promise<Cart> => {
    const response = await apiClient.patch(`/cart/${productId}`, data);
    return response.data || response;
  },

  // Remove item from cart
  removeFromCart: async (productId: string): Promise<Cart> => {
    const response = await apiClient.delete(`/cart/${productId}`);
    return response.data || response;
  },

  // Clear cart
  clearCart: async (): Promise<Cart> => {
    const response = await apiClient.delete('/cart');
    return response.data || response;
  },
};

