'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Package } from 'lucide-react';
import { useDeleteProduct } from '@/hooks/useProducts';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
}

export default function ProductCard({ product, onEdit }: ProductCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const deleteProduct = useDeleteProduct();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setIsDeleting(true);
      try {
        await deleteProduct.mutateAsync(product._id);
      } catch (error) {
        console.error('Failed to delete product:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Image Section */}
      <div className="relative h-48 bg-gray-50">
        {product.image && !imageError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <Package className="h-12 w-12" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit?.(product)}
            className="bg-white/90 hover:bg-white text-blue-600 rounded-full p-2"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-white/90 hover:bg-white text-red-600 rounded-full p-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3">
        <Link href={`/products/${product._id}`}>
          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-500 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm line-clamp-2">
          {product.description || 'No description available.'}
        </p>
        <div className="flex items-center justify-between">
          <Badge className="bg-blue-100 text-blue-700 text-base font-medium px-3 py-1">
            ${product.price.toFixed(2)}
          </Badge>
          <span className="text-xs text-gray-400">
            {new Date(product.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}