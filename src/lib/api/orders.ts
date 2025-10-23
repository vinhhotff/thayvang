import apiClient from '../apiClient';

export enum OrderStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  userId: string;
  products: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessPaymentDto {
  paymentId: string;
  orderId: string;
}

export const ordersApi = {
  // Create order from cart
  createOrder: async (): Promise<Order> => {
    const response = await apiClient.post('/orders');
    return response.data || response;
  },

  // Get all user orders
  getAllOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get('/orders');
    return response.data || response;
  },

  // Get order by ID
  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data || response;
  },

  // Cancel order
  cancelOrder: async (orderId: string): Promise<Order> => {
    const response = await apiClient.patch(`/orders/${orderId}/cancel`);
    return response.data || response;
  },

  // Process payment
  processPayment: async (data: ProcessPaymentDto): Promise<Order> => {
    const response = await apiClient.post('/orders/payment', data);
    return response.data || response;
  },
};

