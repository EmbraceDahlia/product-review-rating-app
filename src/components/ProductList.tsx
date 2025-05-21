import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from "../contexts/ProductContext";

const ProductList: React.FC = () => {
  const { products, loading, error, fetchProducts } = useProduct();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Product List</h1>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.category}</p>
                <p>Average Rating: {product.averageRating}</p>
                <Link to={`/products/${product.id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
