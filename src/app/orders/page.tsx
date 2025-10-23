'use client';

import { useOrders } from '@/hooks/useOrders';
import { Order, OrderStatus } from '@/lib/api/orders';
import Navigation from '@/components/ui/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.UNPAID]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.PAID]: 'bg-green-100 text-green-800',
  [OrderStatus.PROCESSING]: 'bg-blue-100 text-blue-800',
  [OrderStatus.SHIPPED]: 'bg-purple-100 text-purple-800',
  [OrderStatus.DELIVERED]: 'bg-teal-100 text-teal-800',
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const router = useRouter();
  const { orders, isLoading, cancelOrder, isCancellingOrder } = useOrders();
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      cancelOrder(orderId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <Navigation />
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <span className="ml-3 text-gray-600 text-lg">Loading orders...</span>
        </div>
      </div>
    );
  }

  const isEmpty = !orders?.length;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-700 flex items-center gap-3">
            <Package className="h-10 w-10" />
            Order History
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            {isEmpty ? 'No orders yet' : `${orders.length} order(s) found`}
          </p>
        </div>

        {isEmpty ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <Package className="h-24 w-24 mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start shopping to create your first order!</p>
            <Button
              onClick={() => router.push('/products')}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: Order) => {
              const isExpanded = expandedOrders.has(order._id);
              const canCancel = order.status === OrderStatus.UNPAID;

              return (
                <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Order Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleOrderExpansion(order._id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Order ID</p>
                          <p className="font-mono text-sm text-gray-900">{order._id.slice(-8)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="text-sm text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="text-lg font-bold text-blue-600">
                            ${order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            statusColors[order.status]
                          }`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Details (Expandable) */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t">
                      <div className="mt-4 space-y-3">
                        <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                        {order.products.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-3 border-b last:border-b-0"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.productName}</p>
                              <p className="text-sm text-gray-500">
                                ${item.price.toFixed(2)} × {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold text-gray-900">
                              ${item.subtotal.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Order Actions */}
                      {canCancel && (
                        <div className="mt-6 flex justify-end">
                          <Button
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelOrder(order._id);
                            }}
                            disabled={isCancellingOrder}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {isCancellingOrder ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Cancelling...
                              </>
                            ) : (
                              'Cancel Order'
                            )}
                          </Button>
                        </div>
                      )}

                      {/* Payment Info */}
                      {order.paidAt && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-800">
                            <span className="font-semibold">Paid on:</span>{' '}
                            {new Date(order.paidAt).toLocaleString()}
                          </p>
                          {order.paymentId && (
                            <p className="text-sm text-green-800 mt-1">
                              <span className="font-semibold">Payment ID:</span> {order.paymentId}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

