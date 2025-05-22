import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ProductPage from "./components/Product";
import ProductList from "./components/ProductList";
import Layout from "./components/Layout";
import { ProductProvider } from "./contexts/ProductContext";

const App: React.FC = () => {
  return (
    <Router>
      <ProductProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/products" />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductPage />} />
          </Routes>
        </Layout>
      </ProductProvider>
    </Router>
  );
};

export default App;
