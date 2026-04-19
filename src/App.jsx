import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Navbar, Footer } from './components/UIComponents';
import { Home, Products, ProductDetails, Wishlist, Cart, Checkout, HotDeals } from './components/Pages';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - var(--nav-height))', paddingTop: 'var(--nav-height)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/hot-deals" element={<HotDeals />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer theme="dark" position="bottom-right" />
    </div>
  );
}

export default App;
