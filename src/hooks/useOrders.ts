import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi, ProcessPaymentDto } from '@/lib/api/orders';
import { toast } from 'react-toastify';

export const useOrders = () => {
  const queryClient = useQueryClient();

  // Get all orders
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.getAllOrders,
    retry: 1,
  });

  // Create order
  const createOrderMutation = useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Order placed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create order');
    },
  });

  // Cancel order
  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: string) => ordersApi.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order cancelled');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel order');
    },
  });

  // Process payment
  const processPaymentMutation = useMutation({
    mutationFn: (data: ProcessPaymentDto) => ordersApi.processPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Payment processed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Payment failed');
    },
  });

  return {
    orders,
    isLoading,
    error,
    createOrder: createOrderMutation.mutate,
    cancelOrder: cancelOrderMutation.mutate,
    processPayment: processPaymentMutation.mutate,
    isCreatingOrder: createOrderMutation.isPending,
    isCancellingOrder: cancelOrderMutation.isPending,
    isProcessingPayment: processPaymentMutation.isPending,
  };
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.getOrderById(orderId),
    enabled: !!orderId,
    retry: 1,
  });
};

