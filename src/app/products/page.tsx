'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Product, QueryProductDto } from '@/types/product';
import Navigation from '@/components/ui/navigation';
import ProductCard from '@/components/modules/products/ProductCard';
import ProductForm from '@/components/modules/products/ProductForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Loader2 } from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState<QueryProductDto>({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const { data: productsResponse, isLoading, error } = useProducts(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    setQuery(prev => ({
      ...prev,
      sortBy: sortBy as QueryProductDto['sortBy'],
      sortOrder: sortOrder as QueryProductDto['sortOrder'],
      page: 1
    }));
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  const handlePageChange = (page: number) => {
    setQuery(prev => ({ ...prev, page }));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Products</h2>
            <p className="text-gray-500">Please try refreshing or check back later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-700">All Products</h1>
          <p className="text-gray-500 mt-2 text-lg">
            {productsResponse?.meta
              ? `${productsResponse.meta.total} products found`
              : 'Loading products...'}
          </p>
        </div>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <form onSubmit={handleSearch} className="flex-1 flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search products by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border border-blue-200 rounded-lg shadow focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-lg shadow px-6 py-2 text-base font-semibold">
              Search
            </Button>
          </form>
          <Select onValueChange={handleSortChange} defaultValue={`${query.sortBy}-${query.sortOrder}`}>
            <SelectTrigger className="w-[180px] bg-white border border-blue-200 rounded-lg shadow">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
              <SelectItem value="price-asc">Price Low-High</SelectItem>
              <SelectItem value="price-desc">Price High-Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <span className="ml-3 text-gray-600 text-lg">Loading products...</span>
          </div>
        ) : !productsResponse?.data?.length ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-blue-700">No Products Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or sort filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productsResponse.data.map((product: Product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={handleEditProduct}
              />
            ))}
          </div>
        )}
        {/* Pagination */}
        {productsResponse?.meta && productsResponse.meta.totalPages > 1 && (
          <div className="flex items-center justify-center mt-10 gap-3">
            <Button
              variant="outline"
              onClick={() => handlePageChange(query.page! - 1)}
              disabled={query.page === 1}
              className="border-blue-200 hover:bg-blue-50 rounded-lg px-5 py-2 text-base font-semibold"
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-blue-700 font-semibold">
              Page {query.page} of {productsResponse.meta.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(query.page! + 1)}
              disabled={query.page === productsResponse.meta.totalPages}
              className="border-blue-200 hover:bg-blue-50 rounded-lg px-5 py-2 text-base font-semibold"
            >
              Next
            </Button>
          </div>
        )}
        {/* Edit Product Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl text-blue-700">Edit Product</DialogTitle>
            </DialogHeader>
            {editingProduct && (
              <ProductForm
                product={editingProduct}
                onSuccess={handleCloseDialog}
              />
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
