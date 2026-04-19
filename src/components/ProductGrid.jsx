import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, isAsymmetrical = false }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-[var(--text-secondary)] w-full">
        <div className="w-12 h-12 border-4 border-[var(--border-color)] border-t-[var(--accent-color)] rounded-full animate-spin"></div>
        <p className="font-medium animate-pulse">Curating products...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="glass p-12 flex flex-col items-center justify-center text-center rounded-2xl gap-2 w-full">
        <p className="text-xl font-medium">No products found.</p>
        <p className="text-[var(--text-secondary)]">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full ${isAsymmetrical ? '[&>*:nth-child(even)]:translate-y-4 [&>*:nth-child(even)]:mb-4' : ''}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
