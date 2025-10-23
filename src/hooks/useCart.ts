import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartApi, AddToCartDto, UpdateCartItemDto } from '@/lib/api/cart';
import { toast } from 'react-toastify';

export const useCart = () => {
  const queryClient = useQueryClient();

  // Get cart
  const { data: cart, isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
    retry: 1,
  });

  // Add to cart
  const addToCartMutation = useMutation({
    mutationFn: (data: AddToCartDto) => cartApi.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Product added to cart');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add to cart');
    },
  });

  // Update cart item
  const updateCartItemMutation = useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: UpdateCartItemDto }) =>
      cartApi.updateCartItem(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Cart updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update cart');
    },
  });

  // Remove from cart
  const removeFromCartMutation = useMutation({
    mutationFn: (productId: string) => cartApi.removeFromCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Product removed from cart');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove from cart');
    },
  });

  // Clear cart
  const clearCartMutation = useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Cart cleared');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to clear cart');
    },
  });

  return {
    cart,
    isLoading,
    error,
    addToCart: addToCartMutation.mutate,
    updateCartItem: updateCartItemMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isUpdatingCart: updateCartItemMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
    isClearingCart: clearCartMutation.isPending,
  };
};

