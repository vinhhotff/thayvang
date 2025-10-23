'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import Navigation from '@/components/ui/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Trash2, ShoppingCart, Minus, Plus } from 'lucide-react';
import Image from 'next/image';

export default function CartPage() {
  const router = useRouter();
  const { cart, isLoading, updateCartItem, removeFromCart, isUpdatingCart, isRemovingFromCart } = useCart();
  const { createOrder, isCreatingOrder } = useOrders();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdatingItems(prev => new Set(prev).add(productId));
    updateCartItem(
      { productId, data: { quantity: newQuantity } },
      {
        onSettled: () => {
          setUpdatingItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
          });
        },
      }
    );
  };

  const handleRemoveItem = (productId: string) => {
    if (confirm('Remove this item from cart?')) {
      removeFromCart(productId);
    }
  };

  const handleCheckout = () => {
    if (!cart?.items?.length) {
      return;
    }
    createOrder(undefined, {
      onSuccess: () => {
        router.push('/orders');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <Navigation />
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <span className="ml-3 text-gray-600 text-lg">Loading cart...</span>
        </div>
      </div>
    );
  }

  const isEmpty = !cart?.items?.length;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-700 flex items-center gap-3">
            <ShoppingCart className="h-10 w-10" />
            Shopping Cart
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            {isEmpty ? 'Your cart is empty' : `${cart.items.length} item(s) in cart`}
          </p>
        </div>

        {isEmpty ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <ShoppingCart className="h-24 w-24 mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Add some products to get started!</p>
            <Button
              onClick={() => router.push('/products')}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => {
                const isUpdating = updatingItems.has(item.productId._id);
                return (
                  <div
                    key={item.productId._id}
                    className="bg-white rounded-lg shadow-md p-6 flex gap-6 items-center"
                  >
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {item.productId.image ? (
                        <Image
                          src={item.productId.image}
                          alt={item.productId.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingCart className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {item.productId.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {item.productId.description}
                      </p>
                      <p className="text-blue-600 font-bold mt-2">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)}
                        disabled={isUpdating || item.quantity <= 1}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (val > 0) handleUpdateQuantity(item.productId._id, val);
                        }}
                        disabled={isUpdating}
                        className="w-16 text-center"
                        min={1}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)}
                        disabled={isUpdating}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Subtotal & Remove */}
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="text-xl font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.productId._id)}
                        disabled={isRemovingFromCart}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${cart.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${cart.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isCreatingOrder}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg font-semibold"
                >
                  {isCreatingOrder ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push('/products')}
                  className="w-full mt-3"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

