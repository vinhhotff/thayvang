'use client';

import { ArrowLeft, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/modules/products/ProductForm';
import { Button } from '@/components/ui/button';

export default function CreateProductPage() {
  const router = useRouter();

  const handleBack = () => router.back();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PlusCircle className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
          </div>
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="mb-6">
            <p className="text-gray-600 text-base">
              Enter the details below to add a new product to your store.
            </p>
          </div>

          {/* Product Form */}
          <div className="space-y-6">
            <ProductForm />
          </div>

          {/* Cancel Button */}
          <div className="mt-8 flex justify-end">
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}