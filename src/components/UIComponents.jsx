import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, useWishlist, useTheme } from './Context';
import { FiShoppingCart, FiHeart, FiSearch, FiSun, FiMoon, FiHome, FiTag, FiX, FiTrash2, FiMinus, FiPlus, FiArrowRight, FiStar, FiEye, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

// ================= FOOTER =================
export const Footer = () => {
  return (
    <footer className="glass mt-20 border-t border-[var(--border-color)] bg-black/20">
      <div className="container mx-auto px-5 py-12 flex flex-col md:flex-row justify-between gap-8">
        <div className="flex flex-col gap-4 max-w-sm">
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">DKshop</h3>
          <p className="text-[var(--text-secondary)] leading-relaxed text-sm">Premium e-commerce experience simulating modern web design and dynamic features.</p>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-lg">Quick Links</h4>
          <ul className="flex flex-col gap-2">
            <li><Link to="/" className="text-[var(--text-secondary)] hover:text-blue-500 transition-colors text-sm">Home</Link></li>
            <li><Link to="/products" className="text-[var(--text-secondary)] hover:text-blue-500 transition-colors text-sm">Products</Link></li>
            <li><Link to="/cart" className="text-[var(--text-secondary)] hover:text-blue-500 transition-colors text-sm">Cart</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border-color)] py-6 text-center">
        <p className="text-[var(--text-secondary)] text-sm">&copy; {new Date().getFullYear()} DKshop. All rights reserved.</p>
      </div>
    </footer>
  );
};

// ================= FILTERS =================
export const Filters = ({ categories, selectedCategory, onSelectCategory, priceRange, onSelectPriceRange, sortOption, onSelectSortOption, selectedVibe, onSelectVibe }) => {
  const priceRanges = [
    { label: 'All Prices', min: 0, max: Infinity },
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $500', min: 100, max: 500 },
    { label: 'Over $500', min: 500, max: Infinity }
  ];

  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const vibes = ['Minimalist', 'Loud & Proud', 'Cozy Nights', 'Tech Bro', 'Festival Ready'];

  return (
    <div className="glass p-6 rounded-2xl flex flex-col gap-6 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--border-color)]">
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-lg">Categories</h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === '' ? 'bg-[var(--accent-color)] text-white shadow-lg shadow-blue-500/30' : 'bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'}`}
            onClick={() => onSelectCategory('')}
          >
            All Products
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-[var(--accent-color)] text-white shadow-lg shadow-blue-500/30' : 'bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'}`}
              onClick={() => onSelectCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-lg">Vibe Check ✨</h3>
        <div className="flex flex-wrap gap-2">
          {vibes.map(vibe => {
            const formattedVibe = vibe.toLowerCase().replace(/\s+/g, '');
            return (
              <button
                key={vibe}
                type="button"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedVibe === formattedVibe ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 rotate-2 scale-105' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-rose-500 hover:text-rose-500'}`}
                onClick={() => onSelectVibe(selectedVibe === formattedVibe ? '' : formattedVibe)}
              >
                #{formattedVibe}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-lg">Price Range</h3>
        <select
          className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[var(--accent-color)] outline-none appearance-none cursor-pointer"
          value={priceRange.label}
          onChange={(e) => {
            const selected = priceRanges.find(r => r.label === e.target.value);
            onSelectPriceRange(selected);
          }}
        >
          {priceRanges.map(range => (
            <option key={range.label} value={range.label}>{range.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-lg">Sort By</h3>
        <select
          className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[var(--accent-color)] outline-none appearance-none cursor-pointer"
          value={sortOption}
          onChange={(e) => onSelectSortOption(e.target.value)}
        >
          {sortOptions.map(sort => (
            <option key={sort.value} value={sort.value}>{sort.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

// ================= PRODUCT CARD =================
export const ProductCard = ({ product }) => {
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const viewersCount = (product.id * 7) % 40 + 12;
  const isHotDeal = product.isHotDeal || false;
  const originalPrice = isHotDeal ? product.price * 2.5 : product.price;

  const cartItem = cartItems.find(item => item.id === product.id);
  const isInCart = !!cartItem;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.title.substring(0, 20)}... added to cart!`);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="glass flex flex-col h-full rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-300 group">
      <div className="relative h-64 bg-white/5 p-6 flex items-center justify-center overflow-hidden">
        <Link to={`/products/${product.id}`} className="absolute inset-0 flex items-center justify-center p-6">
          <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        </Link>
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {isHotDeal && <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse shadow-rose-500/30 shadow-lg">🔥 60% OFF</span>}
        </div>
        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1 text-[10px] text-white/90">
          <FiEye /> {viewersCount} viewing
        </div>
        <button 
          className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${isInWishlist(product.id) ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-black/30 text-white hover:bg-white/20'}`}
          onClick={handleWishlistToggle}
          aria-label="Toggle Wishlist"
        >
          <FiHeart className={isInWishlist(product.id) ? 'fill-current' : ''} />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3 bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
        <div className="flex justify-between items-start gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--accent-color)]">{product.category}</span>
          <div className="flex items-center gap-1 text-[10px] font-medium text-[var(--text-secondary)] bg-[var(--bg-primary)] px-2 py-1 rounded-full border border-[var(--border-color)] shadow-sm">
            <FiCheckCircle className="text-emerald-500" /> Verified
          </div>
        </div>
        
        <Link to={`/products/${product.id}`} className="flex-1">
          <h3 className="font-semibold text-sm line-clamp-2 text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">{product.title}</h3>
        </Link>
        
        <div className="flex items-center gap-1 text-yellow-500 text-xs">
          <FiStar className="fill-current" />
          <span className="text-[var(--text-primary)] font-medium ml-1">{product.rating?.rate}</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border-color)]">
          <div className="flex flex-col">
            {isHotDeal ? (
              <>
                <span className="text-lg font-bold text-rose-500">${product.price.toFixed(2)}</span>
                <span className="text-xs text-[var(--text-secondary)] line-through">${originalPrice.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          {isInCart ? (
            <div className="flex items-center gap-3 bg-[var(--bg-primary)] rounded-lg p-1 border border-[var(--border-color)]">
              <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--border-color)] transition" onClick={(e) => { e.preventDefault(); if(cartItem.quantity > 1) updateQuantity(product.id, cartItem.quantity - 1); else removeFromCart(product.id); }}>-</button>
              <span className="text-sm font-bold w-4 text-center">{cartItem.quantity}</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--border-color)] transition" onClick={(e) => { e.preventDefault(); updateQuantity(product.id, cartItem.quantity + 1); }}>+</button>
            </div>
          ) : (
            <button className="btn btn-primary px-4 py-2 text-sm" onClick={handleAddToCart}>
              <FiShoppingCart /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ================= PRODUCT GRID =================
export const ProductGrid = ({ products, loading, isAsymmetrical = false }) => {
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

// ================= NAVBAR =================
export const Navbar = () => {
  const { cartCount, toggleCart, isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { wishlistItems } = useWishlist();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') closeCart(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeCart]);

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : 'unset';
  }, [isCartOpen]);

  return (
    <>
      <nav className="glass sticky top-0 z-40 w-full h-[var(--nav-height)] flex items-center shadow-sm">
        <div className="container flex justify-between items-center w-full">
          <Link to="/" className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">DKshop</Link>
          
          <div className="hidden md:flex gap-8 items-center font-medium">
            <Link to="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">Home</Link>
            <Link to="/products" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">Products</Link>
            <Link to="/hot-deals" className="text-rose-500 font-semibold hover:text-rose-400 transition animate-pulse">Hot Deals 🔥</Link>
          </div>

          <div className="hidden md:flex gap-5 items-center">
            <button onClick={toggleTheme} className="text-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">{isDarkMode ? <FiSun /> : <FiMoon />}</button>
            <Link to="/products" className="text-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"><FiSearch /></Link>
            <Link to="/wishlist" className="relative text-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
              <FiHeart />
              {wishlistItems.length > 0 && <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow">{wishlistItems.length}</span>}
            </Link>
            <button onClick={toggleCart} className="relative text-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
              <FiShoppingCart />
              {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-[var(--accent-color)] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow">{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav */}
      <div className="md:hidden glass fixed bottom-0 left-0 w-full h-16 flex justify-around items-center z-40 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <Link to="/" className="flex flex-col items-center gap-1 text-[var(--text-secondary)] hover:text-blue-500 text-xs"><FiHome className="text-xl" /><span>Home</span></Link>
        <Link to="/products" className="flex flex-col items-center gap-1 text-[var(--text-secondary)] hover:text-blue-500 text-xs"><FiSearch className="text-xl" /><span>Discover</span></Link>
        <button onClick={toggleCart} className="relative flex flex-col items-center gap-1 text-[var(--text-secondary)] hover:text-blue-500 text-xs">
          <div className="relative">
            <FiShoppingCart className="text-xl" />
            {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-blue-500 border border-[var(--bg-primary)] rounded-full flex items-center justify-center text-[8px] font-bold text-white content-['']">{cartCount}</span>}
          </div>
          <span>Cart</span>
        </button>
        <Link to="/wishlist" className="relative flex flex-col items-center gap-1 text-[var(--text-secondary)] hover:text-blue-500 text-xs">
          <div className="relative">
            <FiHeart className="text-xl" />
            {wishlistItems.length > 0 && <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-rose-500 border border-[var(--bg-primary)] rounded-full flex items-center justify-center text-[8px] font-bold text-white content-['']">{wishlistItems.length}</span>}
          </div>
          <span>Wishlist</span>
        </Link>
        <Link to="/hot-deals" className="flex flex-col items-center gap-1 text-rose-500 text-xs"><FiTag className="text-xl" /><span>Deals</span></Link>
        <button onClick={toggleTheme} className="flex flex-col items-center gap-1 text-[var(--text-secondary)] text-xs">{isDarkMode ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}<span>Theme</span></button>
      </div>

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeCart} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="fixed top-0 right-0 h-full w-full max-w-md glass z-50 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)]">
                <h2 className="text-xl font-bold">Your Cart <span className="text-[var(--text-secondary)] font-medium">({cartItems.length})</span></h2>
                <button onClick={closeCart} className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition text-[var(--text-secondary)] hover:text-white"><FiX /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-[var(--border-color)]">
                {cartItems.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-[var(--text-secondary)] gap-4">
                    <p>Your cart is empty.</p>
                    <button onClick={closeCart} className="btn btn-primary w-fit">Continue Shopping</button>
                  </div>
                ) : (
                  cartItems.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] group hover:border-[var(--accent-color)] transition-all">
                      <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg bg-white/5" />
                      <div className="flex-1 flex flex-col justify-between">
                        <Link to={`/products/${item.id}`} onClick={closeCart} className="font-medium text-sm line-clamp-2 hover:text-blue-500 transition">{item.title}</Link>
                        <div className="font-bold">${item.price.toFixed(2)}</div>
                        <div className="flex items-center gap-3 bg-[var(--bg-primary)] w-fit rounded-lg p-1 border border-[var(--border-color)]">
                          <button onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeFromCart(item.id)} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[var(--border-color)] transition"><FiMinus className="text-xs" /></button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[var(--border-color)] transition"><FiPlus className="text-xs" /></button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-[var(--text-secondary)] hover:text-rose-500 p-2 transition self-start"><FiTrash2 /></button>
                    </div>
                  ))
                )}
              </div>
              <div className="p-6 border-t border-[var(--border-color)] flex flex-col gap-5 bg-[var(--bg-primary)]">
                <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm p-3 rounded-lg text-center flex items-center justify-center shadow-inner">
                  {cartItems.length > 0 ? "✨ Complete your look with matching accessories." : "✨ Discover our newest arrivals for the season."}
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { closeCart(); navigate('/cart'); }} className="btn btn-secondary py-3 text-sm">View Cart</button>
                  <button onClick={() => { closeCart(); navigate('/checkout'); }} disabled={cartItems.length === 0} className="btn btn-primary py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed group">Checkout <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
