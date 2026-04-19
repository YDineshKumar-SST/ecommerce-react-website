import React, { createContext, useContext, useState, useEffect } from 'react';

// === Cart Context ===
export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cartItems)); }, [cartItems]);

  const toggleCart = () => setIsCartOpen(prev => !prev);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      return [...prev, { ...product, quantity }];
    });
    openCart(); 
  };
  const removeFromCart = (productId) => setCartItems(prev => prev.filter(item => item.id !== productId));
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCartItems(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };
  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, isCartOpen, toggleCart, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
};

// === Wishlist Context ===
export const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('wishlist', JSON.stringify(wishlistItems)); }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems(prev => {
      if (!prev.find(item => item.id === product.id)) return [...prev, product];
      return prev;
    });
  };
  const removeFromWishlist = (productId) => setWishlistItems(prev => prev.filter(item => item.id !== productId));
  const isInWishlist = (productId) => wishlistItems.some(item => item.id === productId);

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

// === Theme Context ===
export const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
