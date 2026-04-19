import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { FiShoppingCart, FiHeart, FiStar, FiEye, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
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
export default ProductCard;
