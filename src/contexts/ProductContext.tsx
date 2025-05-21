import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { Product, Review } from '../types';

interface ProductContextType {
  products: Product[];
  product: Product | null;
  reviews: Review[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => void;
  fetchProductAndReviews: (id: number) => void;
  addReview: (review: Review) => void;
  deleteReview: (reviewId: number) => void;
}


const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products (memoized)
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3003/products");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);
  
  const fetchProductAndReviews = useCallback(async (id: number) => {
    if (product && product.id === id) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const productResponse = await fetch(`http://localhost:3003/products/${id}`);
      const productData = await productResponse.json();
      setProduct(productData);

      const reviewsResponse = await fetch(`http://localhost:3003/products/${id}/reviews`);
      const reviewsData = await reviewsResponse.json();
      setReviews(reviewsData);
    } catch (err) {
      setError('Failed to fetch product details or reviews');
    } finally {
      setLoading(false);
    }
  }, []);


  const addReview = async (review: Review) => {
    try {
      const response = await fetch(`http://localhost:3003/products/${review.productId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(review),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const newReview = await response.json();
      setReviews((prevReviews) => [newReview, ...prevReviews]);
    } catch (err) {
      setError('Failed to add review');
    }
  };
  
  const deleteReview = async (reviewId: number) => {
    try {
      await fetch(`http://localhost:3003/products/${product?.id}/reviews/${reviewId}`, {
        method: 'DELETE',
      });
      setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
    } catch (err) {
      setError('Failed to delete review');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductContext.Provider
      value={{
        products,
        product,
        reviews,
        loading,
        error,
        fetchProducts,
        fetchProductAndReviews,
        addReview,
        deleteReview
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = (): ProductContextType => {
  const context = React.useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};
