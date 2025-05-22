import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '../contexts/ProductContext';
import StarRating from './StarRating';

const PRODUCTS_PER_PAGE = 10;

const ProductList: React.FC = () => {
  const { products, totalCount, categories, loading, error, fetchProducts, fetchProductCategories } = useProduct();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchProductCategories();
  }, [fetchProductCategories]);

  useEffect(() => {
    fetchProducts(currentPage, PRODUCTS_PER_PAGE, selectedCategory);
  }, [fetchProducts, currentPage, selectedCategory]);

  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(1);
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fetchProducts(1, PRODUCTS_PER_PAGE, selectedCategory, searchQuery);
      setCurrentPage(1);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '0' }}>
      <h1 className="mt-4 mb-4 text-center" style={{ flexShrink: 0 }}>
        Product List
      </h1>

      <div className="row mb-3" style={{ flexShrink: 0 }}>
        <div className="col-md-8 mb-3">
          <input
            type="search"
            id="search"
            className="form-control"
            placeholder="Search by product name"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
          />
        </div>

        <div className="col-md-4">
          <div className="mb-3">
            <select
              id="category"
              className="form-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div
        className="row row-cols-1 row-cols-sm-2 row-cols-md-5 row-cols-lg-5"
        style={{
          flex: '1 1 auto',
          overflowY: 'auto', 
          marginBottom: '20px', 
          height: 'calc(100vh - 100px)', 
        }}
      >
        {products.map((product) => (
          <div key={product.id} className="col" style={{ marginBottom: '0px', padding: "0px" }}>
            <div className="card shadow-lg">
              <img
                src={product.imagePath || '/vite.svg'}
                className="card-img-top"
                alt={product.name}
                style={{ objectFit: 'cover', height: '180px' }}
              />
              <div className="card-body d-flex flex-column">
                <h6 className="card-title text-truncate">{product.name}</h6>
                <div className="d-flex justify-content-between align-items-center">
                  <div>

                    <StarRating rating={Number(product.averageRating) || 0} />
                  </div>
                  <div className="mt-2">
                    <Link
                      to={`/products/${product.id}`}
                      className="btn btn-sm btn-outline-primary"
                      style={{
                        borderColor: 'darkred',
                        color: 'darkred'
                      }}
                    >
                      Details
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ flexShrink: 0 }}>
        {totalPages > 1 && (
          <nav className="mt-4">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="page-link"
                  aria-label="Previous"
                >
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                  <button onClick={() => handlePageChange(i + 1)} className="page-link">
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="page-link"
                  aria-label="Next"
                >
                  <span aria-hidden="true">&raquo;</span>
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>


  );
};

export default ProductList;
