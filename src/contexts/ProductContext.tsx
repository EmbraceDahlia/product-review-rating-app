import React, { createContext, useState, useCallback } from 'react';
import type { Product, Review } from '../types';

interface ProductContextType {
  products: Product[];
  totalCount: number;
  categories: string[];
  product: Product | null;
  reviews: Review[];
  loading: boolean;
  error: string | null;
  fetchProducts: (page: number, limit: number, category?: string, searchQuery?: string) => void;
  fetchProductCategories: () => void;
  fetchProductAndReviews: (id: number) => void;
  addReview: (review: Review) => void;
  updateReview: (reviewId: number, review: Review) => void;
  deleteReview: (reviewId: number) => void;
}


const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(
    async (page: number, limit: number, category?: string, searchQuery?: string) => {
      setLoading(true);
      setError(null);
      try {
        let url = `http://localhost:3003/products?page=${page}&limit=${limit}`;
        if (category) url += `&category=${category}`;
        if (searchQuery) url = `http://localhost:3003/products/search?q=${searchQuery}&page=${page}&limit=${limit}`;
        console.log(url);
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data.products);
        setTotalCount(data.totalCount);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchProductCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3003/products/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError('Failed to fetch product categories');
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review)
      });
      const newReview = await response.json();
      setReviews((prevReviews) => [newReview, ...prevReviews]);
    } catch (err) {
      setError('Failed to add review');
    }
  };

  const updateReview = async (reviewId: number, review: Review) => {
    try {
      const response = await fetch(`http://localhost:3003/products/${product?.id}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
      });
      if (!response.ok) {
        throw new Error('Failed to update the review');
      }

      const updatedReview = await response.json();
      setReviews((prevReviews) =>
        prevReviews.map((rev) => (rev.id === reviewId ? updatedReview : rev))
      );
    } catch (err) {
      setError('Failed to update review');
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

  return (
    <ProductContext.Provider
      value={{
        products,
        totalCount,
        categories,
        product,
        reviews,
        loading,
        error,
        fetchProducts,
        fetchProductCategories,
        fetchProductAndReviews,
        addReview,
        updateReview,
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
