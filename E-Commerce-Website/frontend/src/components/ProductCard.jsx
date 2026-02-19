import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';


// Curated Unsplash fashion photos keyed by category keyword
const FASHION_IMAGES = [
  'photo-1596755094514-f87e34085b2c', // shirts
  'photo-1594938298603-c8148c4dae35', // chinos / pants
  'photo-1551028719-00167b16eac5', // denim jacket
  'photo-1572804013309-59a88b7e92f1', // floral dress
  'photo-1509631179647-0177331693ae', // palazzo pants
  'photo-1610030469983-98e550d6193c', // saree
  'photo-1583391733956-3750e0ff4e8b', // kurta
  'photo-1519238263530-99bdd11df2ea', // kids wear
  'photo-1614252235316-8c857d38b5f4', // formal shoes
  'photo-1601924582970-9238bcb495d9', // stole / accessories
];

const getProductImage = (product) => {
  const idx = ((product.productId || 1) - 1) % FASHION_IMAGES.length;
  return `https://images.unsplash.com/${FASHION_IMAGES[idx]}?w=400&h=530&fit=crop&q=80`;
};

const ProductCard = ({ product, index = 0 }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [inWishlist, setInWishlist] = useState(false);

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.info('Please sign in to save items');
      return;
    }
    setInWishlist(!inWishlist);
    toast.success(inWishlist ? 'Removed from Wishlist' : 'Added to Wishlist');
  };
  const imgSrc = getProductImage(product);

  // Derive available sizes from variants
  const sizes = product.variants
    ? [...new Set(product.variants.map((v) => v.size).filter(Boolean))].slice(0, 4)
    : [];

  const handleCardClick = () => {
    navigate(`/product/${product.productId}`);
  };

  return (
    <div
      className="group animate-fade-in cursor-pointer"
      style={{ animationDelay: `${index * 0.07}s` }}
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(); }}
    >
      {/* Image Container */}
      <div className="relative block aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={product.productName}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=75'; }}
        />

        {/* Discount Badge */}
        {product.productDiscount > 0 && (
          <span className="absolute left-3 top-3 bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            -{product.productDiscount}%
          </span>
        )}

        {/* Quick View Overlay */}
        <div className="absolute bottom-0 left-0 right-0 flex translate-y-full items-center justify-center gap-3 bg-white/90 backdrop-blur-sm py-3 transition-transform duration-300 group-hover:translate-y-0">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.productId}`); }}
            className="flex items-center gap-2 bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-accent"
          >
            Select Options
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toast.info("Wishlist feature coming soon!", { autoClose: 1500 }); }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition hover:border-accent hover:text-accent"
            aria-label="Wishlist"
          >
            <FiHeart size={14} fill={inWishlist ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        {product.brand && (
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">{product.brand}</span>
        )}
        <p className="text-sm font-medium text-primary line-clamp-1 transition group-hover:text-accent">
          {product.productName}
        </p>
        {/* Show available sizes */}
        {sizes.length > 0 && (
          <p className="text-[10px] text-muted">{sizes.join(' · ')}{product.variants.length > 4 ? ' …' : ''}</p>
        )}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-primary">
            ₹{product.productPriceAfterDiscount || product.productPrice}
          </span>
          {product.productDiscount > 0 && (
            <span className="text-xs text-muted line-through">
              ₹{product.productPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
