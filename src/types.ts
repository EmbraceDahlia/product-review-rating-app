export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  averageRating: number;
  imagePath: string;
}

export interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}
