'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Product, CreateProductDto, UpdateProductDto } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { useRouter } from 'next/navigation';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  price: z.number().min(0, 'Price must be positive'),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      image: product?.image || '',
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      const formData = {
        ...data,
        image: data.image || undefined,
      };

      if (isEditing) {
        await updateProduct.mutateAsync({
          id: product._id,
          data: formData as UpdateProductDto,
        });
      } else {
        await createProduct.mutateAsync(formData as CreateProductDto);
        reset();
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter product name"
              className={`mt-1 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter product description"
              rows={5}
              className={`mt-1 ${errors.description ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="price" className="text-sm font-medium text-gray-700">
              Price <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              {...register('price', { valueAsNumber: true })}
              placeholder="0.00"
              className={`mt-1 ${errors.price ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="image" className="text-sm font-medium text-gray-700">
              Image URL
            </Label>
            <Input
              id="image"
              {...register('image')}
              placeholder="https://example.com/image.jpg"
              className={`mt-1 ${errors.image ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
         
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting 
              ? (isEditing ? 'Updating...' : 'Creating...') 
              : (isEditing ? 'Update Product' : 'Create Product')
            }
          </Button>
        </div>
      </form>
    </div>
  );
}