import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTruck, FiRefreshCcw, FiShield, FiSearch, FiShoppingCart, FiHeart, FiStar, FiTrash2, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { FaApple, FaGooglePay } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { useCart, useWishlist } from './Context';
import { useProducts, useDebounce } from './Hooks';
import { fetchProductById } from './Services';
import { ProductGrid, Filters } from './UIComponents';

// ================= HOME =================
export const Home = () => {
  const { products, loading } = useProducts();
  const featuredProducts = products ? products.slice(0, 4) : [];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const banners = [
    { id: 1, title: 'Summer Collection 2026', subtitle: 'Discover the latest trends in fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1470&auto=format&fit=crop' },
    { id: 2, title: 'Tech Gadgets', subtitle: 'Upgrade your lifestyle with new tech', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1470&auto=format&fit=crop' },
    { id: 3, title: 'Premium Accessories', subtitle: 'Elevate your everyday look', image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=1530&auto=format&fit=crop' }
  ];

  return (
    <div className="fade-in flex flex-col gap-16 pb-16">
      <section className="relative h-[60vh] min-h-[500px] w-full mt-[-1px]">
        <Swiper modules={[Pagination, Autoplay, EffectFade]} effect="fade" pagination={{ clickable: true }} autoplay={{ delay: 5000, disableOnInteraction: false }} className="w-full h-full">
          {banners.map(banner => (
            <SwiperSlide key={banner.id}>
              <div className="w-full h-full bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url(${banner.image})` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
                <div className="container relative h-full flex flex-col justify-center items-start text-white max-w-2xl px-8">
                  <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tight">
                    {banner.title}
                  </motion.h1>
                  <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg">
                    {banner.subtitle}
                  </motion.p>
                  <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
                    <Link to="/products" className="btn bg-white text-black hover:bg-gray-100 hover:-translate-y-1 transition-transform border-none font-bold">
                      Shop Now <FiArrowRight />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="container">
        <div className="flex justify-between items-end mb-8 border-b border-[var(--border-color)] pb-4">
          <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
          <Link to="/products" className="text-[var(--accent-color)] font-medium flex items-center gap-1 hover:underline">View All <FiArrowRight /></Link>
        </div>
        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      <section className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-8 rounded-2xl flex items-center gap-6 hover:-translate-y-1 transition-transform cursor-default">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 text-blue-500 flex flex-shrink-0 items-center justify-center text-2xl"><FiTruck /></div>
            <div><h3 className="font-bold text-lg mb-1">Free Shipping</h3><p className="text-[var(--text-secondary)] text-sm">On all orders over $100</p></div>
          </div>
          <div className="glass p-8 rounded-2xl flex items-center gap-6 hover:-translate-y-1 transition-transform cursor-default">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 flex flex-shrink-0 items-center justify-center text-2xl"><FiRefreshCcw /></div>
            <div><h3 className="font-bold text-lg mb-1">Easy Returns</h3><p className="text-[var(--text-secondary)] text-sm">30 days return policy</p></div>
          </div>
          <div className="glass p-8 rounded-2xl flex items-center gap-6 hover:-translate-y-1 transition-transform cursor-default">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex flex-shrink-0 items-center justify-center text-2xl"><FiShield /></div>
            <div><h3 className="font-bold text-lg mb-1">Secure Payment</h3><p className="text-[var(--text-secondary)] text-sm">100% secure checkout</p></div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ================= PRODUCTS =================
const vibesList = ['Minimalist', 'Loud & Proud', 'Cozy Nights', 'Tech Bro', 'Festival Ready'];

export const Products = () => {
  const { products, categories, loading } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('');
  const [priceRange, setPriceRange] = useState({ label: 'All Prices', min: 0, max: Infinity });
  const [sortOption, setSortOption] = useState('default');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];
    let result = [...products];
    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);
    if (debouncedSearchTerm) {
      const lowerReq = debouncedSearchTerm.toLowerCase();
      result = result.filter(p => (p.title || '').toLowerCase().includes(lowerReq) || (p.description || '').toLowerCase().includes(lowerReq));
    }
    if (priceRange.label !== 'All Prices') result = result.filter(p => Number(p.price) >= priceRange.min && Number(p.price) <= priceRange.max);
    if (selectedVibe) {
      result = result.filter(p => {
        const prodVibeRaw = vibesList[(p.id || 0) % vibesList.length] || '';
        return prodVibeRaw.toLowerCase().replace(/\s+/g, '') === selectedVibe;
      });
    }
    if (sortOption === 'price-asc') result.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sortOption === 'price-desc') result.sort((a, b) => Number(b.price) - Number(a.price));
    else if (sortOption === 'rating') result.sort((a, b) => (Number(b.rating?.rate) || 0) - (Number(a.rating?.rate) || 0));
    return result;
  }, [products, selectedCategory, debouncedSearchTerm, priceRange, sortOption, selectedVibe]);

  return (
    <div className="container py-8 fade-in flex flex-col gap-8 min-h-[70vh]">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)]">
        <h1 className="text-3xl font-bold tracking-tight">Our Collection</h1>
        <div className="relative w-full md:w-80 flex-shrink-0">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-lg pointer-events-none" />
          <input 
            type="text" 
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-full py-3 pl-12 pr-4 focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent outline-none transition-all placeholder:text-[var(--text-secondary)]" 
            placeholder="Search for products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-[calc(var(--nav-height)+2rem)]">
          <Filters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            priceRange={priceRange}
            onSelectPriceRange={setPriceRange}
            sortOption={sortOption}
            onSelectSortOption={setSortOption}
            selectedVibe={selectedVibe}
            onSelectVibe={setSelectedVibe}
          />
        </aside>

        <main className="flex-1 w-full min-w-0 flex flex-col gap-6">
          <div className="text-[var(--text-secondary)] font-medium">
            Showing <span className="text-[var(--text-primary)]">{filteredAndSortedProducts.length}</span> result{filteredAndSortedProducts.length !== 1 ? 's' : ''}
          </div>
          <ProductGrid products={filteredAndSortedProducts} loading={loading} />
        </main>
      </div>
    </div>
  );
};

// ================= PRODUCT DETAILS =================
export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
    const getProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-20 flex flex-col items-center justify-center gap-4 min-h-[60vh] text-[var(--text-secondary)]">
        <div className="w-12 h-12 border-4 border-[var(--border-color)] border-t-[var(--accent-color)] rounded-full animate-spin"></div>
        <p className="font-medium animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-20 flex flex-col items-center justify-center gap-6 min-h-[60vh]">
        <h2 className="text-2xl font-bold">{error || "Product not found"}</h2>
        <button className="btn btn-secondary py-3 px-6" onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="container py-12 fade-in min-h-[70vh] flex flex-col gap-8">
      <Link to="/products" className="text-[var(--text-secondary)] hover:text-blue-500 font-medium flex items-center gap-2 w-fit transition-colors bg-[var(--bg-secondary)] py-2 px-4 rounded-full border border-[var(--border-color)]">
        <FiArrowLeft /> Back to Products
      </Link>
      
      <div className="glass rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-2xl border border-[var(--border-color)]">
        <div className="w-full lg:w-1/2 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-[var(--border-color)] bg-white/5 flex items-center justify-center relative group min-h-[300px]">
          <img src={product.image} alt={product.title} className="max-w-full max-h-[500px] object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" />
        </div>
        
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col gap-6 bg-[var(--bg-secondary)]">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--accent-color)]">{product.category}</span>
            <h1 className="text-3xl lg:text-4xl font-black leading-tight tracking-tight text-[var(--text-primary)]">{product.title}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center text-yellow-500 gap-1 text-lg">
              <FiStar className="fill-current" />
              <span className="text-[var(--text-primary)] font-bold">{product.rating?.rate}</span>
            </div>
            <span className="text-[var(--text-secondary)] text-sm ml-2.5 px-3 py-1 bg-[var(--bg-primary)] rounded-full border border-[var(--border-color)]">{product.rating?.count} reviews</span>
          </div>

          <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 w-fit">${product.price.toFixed(2)}</p>
          
          <div className="flex flex-col gap-3 mt-4">
            <h3 className="font-bold text-lg border-b border-[var(--border-color)] pb-2">Description</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">{product.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-8">
            <button className="flex-1 btn btn-primary py-4 text-lg shadow-lg shadow-blue-500/30 font-bold" onClick={handleAddToCart}>
              <FiShoppingCart className="text-xl" /> Add to Cart
            </button>
            <button 
              className={`flex-1 sm:flex-none btn py-4 text-lg border-2 font-bold ${isInWishlist(product.id) ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/30' : 'bg-transparent text-[var(--text-primary)] border-[var(--border-color)] hover:border-rose-500 hover:text-rose-500'}`}
              onClick={handleWishlistToggle}
            >
              <FiHeart className={isInWishlist(product.id) ? 'fill-current' : ''} /> 
              <span className="sm:hidden lg:inline ml-2">{isInWishlist(product.id) ? 'In Wishlist' : 'Wishlist'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================= WISHLIST =================
export const Wishlist = () => {
  const { wishlistItems } = useWishlist();

  return (
    <div className="container py-12 fade-in min-h-[70vh] flex flex-col gap-8">
      <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Your Wishlist</h1>
        <Link to="/products" className="btn btn-secondary py-2 px-4 shadow-sm hover:shadow-md transition text-sm">
          <FiArrowLeft className="inline mr-1" /> Continue Shopping
        </Link>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center p-16 rounded-3xl text-center gap-4">
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center text-4xl mb-2 border border-rose-500/20">
            <FiHeart />
          </div>
          <h2 className="text-2xl font-bold">Your wishlist is empty</h2>
          <p className="text-[var(--text-secondary)] max-w-sm">Explore our collection and add your favorite items to your wishlist!</p>
          <Link to="/products" className="btn btn-primary mt-4 py-3 px-6 shadow-lg shadow-blue-500/20">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <p className="text-[var(--text-secondary)] font-medium bg-[var(--bg-secondary)] py-3 px-5 rounded-xl border border-[var(--border-color)] w-fit">
            You have <span className="text-[var(--text-primary)] font-bold px-1">{wishlistItems.length}</span> item{wishlistItems.length !== 1 ? 's' : ''} saved.
          </p>
          <ProductGrid products={wishlistItems} loading={false} />
        </div>
      )}
    </div>
  );
};

// ================= CART =================
export const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container py-20 fade-in flex items-center justify-center min-h-[60vh]">
        <div className="glass max-w-md w-full p-12 rounded-3xl flex flex-col items-center text-center gap-4">
          <div className="w-24 h-24 bg-[var(--bg-primary)] rounded-full flex items-center justify-center text-[var(--text-secondary)] text-4xl mb-4 border border-[var(--border-color)]">
            <FiShoppingCart />
          </div>
          <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
          <p className="text-[var(--text-secondary)]">Explore our products and find something you love!</p>
          <Link to="/products" className="btn btn-primary mt-6 w-full py-4 text-base shadow-lg shadow-blue-500/20">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const tax = cartTotal * 0.08;
  const shipping = cartTotal > 100 ? 0 : 10;
  const finalTotal = cartTotal + tax + shipping;

  return (
    <div className="container py-12 fade-in min-h-[70vh] flex flex-col gap-8">
      <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
        <Link to="/products" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition flex items-center gap-2 font-medium">
          <FiArrowLeft /> Continue Shopping
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="glass flex-1 w-full rounded-2xl overflow-hidden p-0 sm:p-6">
          <div className="hidden sm:grid grid-cols-[3fr_1fr_1fr] gap-4 p-4 border-b border-[var(--border-color)] text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            <span>Product</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Subtotal</span>
          </div>
          
          <ul className="flex flex-col">
            {cartItems.map(item => (
              <li key={item.id} className="grid grid-cols-1 sm:grid-cols-[3fr_1fr_1fr] gap-6 p-6 border-b border-[var(--border-color)] last:border-0 items-center group transition-colors hover:bg-white/5">
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-24 shrink-0 bg-white/5 rounded-xl border border-[var(--border-color)] overflow-hidden p-2">
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col gap-1 items-start">
                    <Link to={`/products/${item.id}`} className="font-semibold text-lg line-clamp-2 hover:text-[var(--accent-color)] transition-colors">{item.title}</Link>
                    <span className="text-xs uppercase tracking-wide font-bold text-[var(--text-secondary)]">{item.category}</span>
                    <span className="text-[var(--accent-color)] font-bold mt-1">${item.price.toFixed(2)}</span>
                    <button className="text-rose-500/70 hover:text-rose-500 text-sm flex items-center gap-1 mt-2 transition-colors" onClick={() => removeFromCart(item.id)}>
                      <FiTrash2 /> Remove
                    </button>
                  </div>
                </div>

                <div className="flex justify-between sm:justify-center items-center">
                  <span className="sm:hidden font-medium text-[var(--text-secondary)]">Quantity:</span>
                  <div className="flex items-center gap-3 bg-[var(--bg-primary)] p-1 rounded-lg border border-[var(--border-color)]">
                    <button disabled={item.quantity <= 1} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--bg-secondary)] disabled:opacity-50 transition" onClick={() => updateQuantity(item.id, item.quantity - 1)}><FiMinus /></button>
                    <span className="w-6 text-center font-bold">{item.quantity}</span>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--bg-secondary)] transition" onClick={() => updateQuantity(item.id, item.quantity + 1)}><FiPlus /></button>
                  </div>
                </div>

                <div className="flex justify-between sm:justify-end items-center font-bold text-lg">
                  <span className="sm:hidden font-medium text-[var(--text-secondary)] text-base">Subtotal:</span>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass w-full lg:w-96 rounded-2xl p-8 flex flex-col gap-6 sticky top-[calc(var(--nav-height)+2rem)]">
          <h2 className="text-xl font-bold border-b border-[var(--border-color)] pb-4">Order Summary</h2>
          <div className="flex flex-col gap-4 text-sm font-medium">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[var(--text-secondary)]">Tax (Estimated 8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[var(--text-secondary)]">Shipping</span>
              <span className={shipping === 0 ? "text-emerald-500" : ""}>{shipping === 0 ? 'Free' : '$10.00'}</span>
            </div>
          </div>
          <div className="border-t border-[var(--border-color)] pt-4 flex justify-between items-center text-xl font-black">
            <span>Total</span>
            <span className="text-[var(--accent-color)]">${finalTotal.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary w-full py-4 text-base mt-2 shadow-lg shadow-blue-500/20" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= CHECKOUT =================
const checkoutSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  zipCode: yup.string().required('Zip code is required').matches(/^[0-9]+$/, "Must be only digits").min(5, 'Must be 5 digits').max(5, 'Must be 5 digits'),
  cardNumber: yup.string().required('Card number is required').matches(/^[0-9]+$/, "Must be only digits").min(16, 'Must be 16 digits').max(16, 'Must be 16 digits'),
  cvv: yup.string().required('CVV is required').matches(/^[0-9]+$/, "Must be only digits").min(3, '3 digits').max(4, '4 digits'),
});

export const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items to checkout.");
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(checkoutSchema)
  });

  const onSubmit = (data) => {
    toast.success("Order Placed Successfully!");
    clearCart();
    navigate('/');
  };

  const tax = cartTotal * 0.08;
  const shipping = cartTotal > 100 ? 0 : 10;
  const total = cartTotal + tax + shipping;

  if (cartItems.length === 0) return null;

  return (
    <div className="container py-12 fade-in min-h-[70vh] flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight border-b border-[var(--border-color)] pb-6">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="glass flex-1 w-full rounded-2xl p-8 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Express Checkout</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <button type="button" className="flex-1 btn bg-black text-white hover:bg-gray-800 py-3" onClick={handleSubmit(onSubmit)}><FaApple className="text-xl" /> Pay</button>
              <button type="button" className="flex-1 btn bg-white text-black hover:bg-gray-100 py-3 border border-gray-300" onClick={handleSubmit(onSubmit)}><FaGooglePay size={36} className="-m-1" /></button>
            </div>
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-[var(--border-color)]"></div>
              <span className="flex-shrink-0 mx-4 text-[var(--text-secondary)] text-sm font-bold uppercase tracking-widest">or continue below</span>
              <div className="flex-grow border-t border-[var(--border-color)]"></div>
            </div>
          </div>
          
          <h2 className="text-xl font-bold">Billing Details</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">First Name</label>
                <input type="text" {...register('firstName')} className={`w-full bg-[var(--bg-primary)] border ${errors.firstName ? 'border-rose-500' : 'border-[var(--border-color)]'} text-[var(--text-primary)] rounded-lg py-3 px-4 focus:ring-2 focus:ring-[var(--accent-color)] outline-none`} />
                {errors.firstName && <span className="text-xs text-rose-500 mt-1">{errors.firstName.message}</span>}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Last Name</label>
                <input type="text" {...register('lastName')} className={`w-full bg-[var(--bg-primary)] border ${errors.lastName ? 'border-rose-500' : 'border-[var(--border-color)]'} text-[var(--text-primary)] rounded-lg py-3 px-4 focus:ring-2 focus:ring-[var(--accent-color)] outline-none`} />
                {errors.lastName && <span className="text-xs text-rose-500 mt-1">{errors.lastName.message}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Email Address</label>
              <input type="email" {...register('email')} className={`w-full bg-[var(--bg-primary)] border ${errors.email ? 'border-rose-500' : 'border-[var(--border-color)]'} text-[var(--text-primary)] rounded-lg py-3 px-4 focus:ring-2 focus:ring-[var(--accent-color)] outline-none`} />
              {errors.email && <span className="text-xs text-rose-500 mt-1">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Address</label>
              <input type="text" {...register('address')} className={`w-full bg-[var(--bg-primary)] border ${errors.address ? 'border-rose-500' : 'border-[var(--border-color)]'} text-[var(--text-primary)] rounded-lg py-3 px-4 focus:ring-2 focus:ring-[var(--accent-color)] outline-none`} />
              {errors.address && <span className="text-xs text-rose-500 mt-1">{errors.address.message}</span>}
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">City</label>
                <input type="text" {...register('city')} className={`w-full bg-[var(--bg-primary)] border ${errors.city ? 'border-rose-500' : 'border-[var(--border-color)]'} text-[var(--text-primary)] rounded-lg py-3 px-4 focus:ring-2 focus:ring-[var(--accent-color)] outline-none`} />
                {errors.city && <span className="text-xs text-rose-500 mt-1">{errors.city.message}</span>}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Zip Code</label>
                <input type="text" {...register('zipCode')} className={`w-full bg-[var(--bg-primary)] border ${errors.zipCode ? 'border-rose-500' : 'border-[var(--border-color)]'} text-[var(--text-primary)] rounded-lg py-3 px-4 focus:ring-2 focus:ring-[var(--accent-color)] outline-none`} />
                {errors.zipCode && <span className="text-xs text-rose-500 mt-1">{errors.zipCode.message}</span>}
              </div>
            </div>

            <h2 className="text-xl font-bold mt-6 pt-6 border-t border-[var(--border-color)]">Payment Information</h2>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Card Number</label>
              <input type="text" {...register('cardNumber')} placeholder="0000 0000 0000 0000" className={`w-full bg-[var(--bg-primary)] border ${errors.cardNumber ? 'border-rose-500' : 'border-[var(--border-color)]'} text-[var(--text-primary)] rounded-lg py-3 px-4 focus:ring-2 focus:ring-[var(--accent-color)] outline-none`} />
              {errors.cardNumber && <span className="text-xs text-rose-500 mt-1">{errors.cardNumber.message}</span>}
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Expiration Date</label>
                <input type="text" placeholder="MM/YY" className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg py-3 px-4 focus:ring-2 focus:ring-[var(--accent-color)] outline-none" />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">CVV</label>
                <input type="text" {...register('cvv')} placeholder="123" className={`w-full bg-[var(--bg-primary)] border ${errors.cvv ? 'border-rose-500' : 'border-[var(--border-color)]'} text-[var(--text-primary)] rounded-lg py-3 px-4 focus:ring-2 focus:ring-[var(--accent-color)] outline-none`} />
                {errors.cvv && <span className="text-xs text-rose-500 mt-1">{errors.cvv.message}</span>}
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-6 py-4 text-base font-bold shadow-lg shadow-blue-500/30">
              Place Order
            </button>
          </form>
        </div>

        <div className="glass w-full lg:w-96 rounded-2xl p-8 flex flex-col gap-6 sticky top-[calc(var(--nav-height)+2rem)]">
          <h2 className="text-xl font-bold border-b border-[var(--border-color)] pb-4">Order Summary</h2>
          <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[var(--border-color)]">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm items-center gap-4">
                <span className="text-[var(--text-secondary)] line-clamp-1">{item.quantity} x {item.title}</span>
                <span className="font-bold shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-[var(--border-color)] pt-4 flex flex-col gap-4 text-sm font-medium">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[var(--text-secondary)]">Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[var(--text-secondary)]">Shipping</span>
              <span className={shipping === 0 ? "text-emerald-500" : ""}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
          </div>
          
          <div className="border-t border-[var(--border-color)] pt-4 flex justify-between items-center text-xl font-black">
            <span>Total</span>
            <span className="text-[var(--accent-color)]">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================= HOT DEALS =================
export const HotDeals = () => {
  const { products, loading } = useProducts();
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) { seconds--; }
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hotDeals = useMemo(() => {
    if (!products) return [];
    return products.filter((p, index) => index % 3 === 0 || p.id === 5).map(p => ({
      ...p,
      isHotDeal: true
    }));
  }, [products]);

  return (
    <div className="container fade-in pb-16">
      <div className="relative rounded-t-none rounded-b-3xl md:rounded-3xl mt-[-1px] md:mt-6 mb-12 overflow-hidden bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center text-center p-12 md:p-20 shadow-[0_20px_50px_rgba(244,63,94,0.15)]">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-500 via-zinc-900 to-black"></div>
        <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg shadow-rose-500/20 relative">
            <span className="w-2 h-2 rounded-full bg-rose-500 flex animate-ping absolute left-4"></span>
            <span className="w-2 h-2 rounded-full bg-rose-500 flex mr-1 ml-4 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
            LIVE NOW
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            CYBER WEEK <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400">STEALS</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl text-center font-medium">
            Unbelievable discounts on premium gear. Once they're gone, they're gone forever.
          </p>
          <div className="flex gap-4 mt-4">
            <div className="flex flex-col items-center justify-center bg-black/50 backdrop-blur-md rounded-2xl w-24 h-24 border border-zinc-800 shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]">
              <span className="text-white text-3xl font-black">{timeLeft.hours.toString().padStart(2, '0')}</span>
              <small className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Hours</small>
            </div>
            <div className="flex flex-col items-center justify-center bg-black/50 backdrop-blur-md rounded-2xl w-24 h-24 border border-zinc-800 shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]">
              <span className="text-white text-3xl font-black">{timeLeft.minutes.toString().padStart(2, '0')}</span>
              <small className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Mins</small>
            </div>
            <div className="flex flex-col items-center justify-center bg-black/50 backdrop-blur-md rounded-2xl w-24 h-24 border border-zinc-800 shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]">
              <span className="text-rose-400 text-3xl font-black">{timeLeft.seconds.toString().padStart(2, '0')}</span>
              <small className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Secs</small>
            </div>
          </div>
        </div>
      </div>
      <div>
        <ProductGrid products={hotDeals} loading={loading} isAsymmetrical={false} />
      </div>
    </div>
  );
};
