'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useProduct, useDeleteProduct } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Edit, Trash2, Package } from 'lucide-react';
import { useState } from 'react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { data: productResponse, isLoading, error } = useProduct(productId);
  const deleteProduct = useDeleteProduct();
  const product = productResponse?.data;

  const handleEdit = () => router.push(`/products/edit/${productId}`);
  const handleBack = () => router.back();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setIsDeleting(true);
    try {
      await deleteProduct.mutateAsync(productId);
      router.push('/');
    } catch (err) {
      console.error('Failed to delete product:', err);
      setIsDeleting(false);
    }
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-6 p-8 bg-white rounded-xl shadow-md max-w-md w-full">
          <h2 className="text-3xl font-bold text-red-600">Product Not Found</h2>
          <p className="text-gray-500">The product youre looking for doesnt exist or has been removed.</p>
          <Button 
            onClick={handleBack} 
            variant="outline" 
            className="border-blue-500 text-blue-500 hover:bg-blue-50"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Section */}
          <div className="relative h-96 md:h-full">
            {product.image && !imageError ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <Package className="h-20 w-20 text-gray-400" />
              </div>
            )}
            <button
              onClick={handleBack}
              className="absolute top-4 left-4 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <Badge className="mt-2 bg-blue-600 text-white text-lg py-1 px-4">
                ${product.price.toFixed(2)}
              </Badge>
            </div>
            
            <p className="text-gray-600 leading-relaxed">
              {product.description || 'No description available for this product.'}
            </p>

            <div className="space-y-2 text-sm text-gray-500">
              <p><span className="font-medium">Created:</span> {new Date(product.createdAt).toLocaleDateString()}</p>
              <p><span className="font-medium">Updated:</span> {new Date(product.updatedAt).toLocaleDateString()}</p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleEdit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit className="h-5 w-5 mr-2" /> Edit Product
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="h-5 w-5 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete Product'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}