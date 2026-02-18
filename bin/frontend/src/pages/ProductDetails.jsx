import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { FiShoppingBag, FiHeart, FiChevronLeft } from 'react-icons/fi';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);

        // Auto-select first variant
        if (res.data.variants?.length > 0) {
          const first = res.data.variants[0];
          setSelectedSize(first.size);
          setSelectedColor(first.color);
          setSelectedVariant(first);
        }
      } catch (err) {
        console.error('Error fetching product', err);
      }
    };
    fetchProduct();
  }, [id]);

  // Resolve variant when size/color change
  useEffect(() => {
    if (!product?.variants) return;
    const match = product.variants.find(
      (v) => v.size === selectedSize && v.color === selectedColor
    );
    setSelectedVariant(match || null);
  }, [selectedSize, selectedColor, product]);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-accent" />
      </div>
    );
  }

  // Curated Unsplash fashion photos (same set as ProductCard)
  const FASHION_IMAGES = [
    'photo-1596755094514-f87e34085b2c',
    'photo-1594938298603-c8148c4dae35',
    'photo-1551028719-00167b16eac5',
    'photo-1572804013309-59a88b7e92f1',
    'photo-1509631179647-0177331693ae',
    'photo-1610030469983-98e550d6193c',
    'photo-1583391733956-3750e0ff4e8b',
    'photo-1519238263530-99bdd11df2ea',
    'photo-1614252235316-8c857d38b5f4',
    'photo-1601924582970-9238bcb495d9',
  ];
  const imgIdx = ((product.productId || 1) - 1) % FASHION_IMAGES.length;
  const imgSrc = `https://images.unsplash.com/${FASHION_IMAGES[imgIdx]}?w=800&h=1060&fit=crop&q=80`;

  // Extract unique sizes & colors from variants
  const sizes = [...new Set(product.variants?.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(product.variants?.map((v) => v.color).filter(Boolean))];

  // Available colors for currently selected size
  const colorsForSize = [...new Set(
    product.variants?.filter((v) => v.size === selectedSize).map((v) => v.color).filter(Boolean)
  )];

  return (
    <div className="animate-fade-in py-10">
      <Link to="/" className="mb-8 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-widest text-muted transition hover:text-primary">
        <FiChevronLeft size={14} /> Back to collections
      </Link>

      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        {/* Image */}
        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={imgSrc}
            alt={product.productName}
            className="h-full w-full object-cover"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80'; }}
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          {product.brand && (
            <span className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
              {product.brand}
            </span>
          )}
          {product.category && (
            <span className="mb-2 text-xs font-medium uppercase tracking-widest text-muted">
              {product.category.categoryName}
            </span>
          )}
          <h1 className="font-serif text-3xl font-bold text-primary sm:text-4xl">
            {product.productName}
          </h1>
          <p className="mt-4 leading-relaxed text-muted">
            {product.productDescription || 'Premium quality garment crafted with attention to detail and comfort.'}
          </p>

          {/* Pricing */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-2xl font-bold text-primary">
              ₹{product.productPriceAfterDiscount || product.productPrice}
            </span>
            {product.productDiscount > 0 && (
              <>
                <span className="text-lg text-muted line-through">₹{product.productPrice}</span>
                <span className="rounded bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent">
                  {product.productDiscount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Color Selector */}
          {colors.length > 0 && (
            <div className="mt-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Color — <span className="font-normal text-muted">{selectedColor}</span>
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {colors.map((c) => {
                  const isAvailable = !selectedSize || colorsForSize.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      disabled={!isAvailable}
                      className={`min-w-[60px] border px-3 py-2 text-xs font-medium transition ${
                        selectedColor === c
                          ? 'border-primary bg-primary text-white'
                          : isAvailable
                          ? 'border-gray-200 text-muted hover:border-gray-400'
                          : 'border-gray-100 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {sizes.length > 0 && (
            <div className="mt-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Size</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {sizes.map((s) => {
                  // Check if this size is in stock for any color (or for selected color)
                  const variantsForSize = product.variants.filter((v) => v.size === s);
                  const hasStock = variantsForSize.some((v) => v.stock > 0);
                  return (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      disabled={!hasStock}
                      className={`min-w-[44px] border px-3 py-2 text-xs font-medium transition ${
                        selectedSize === s
                          ? 'border-primary bg-primary text-white'
                          : hasStock
                          ? 'border-gray-200 text-muted hover:border-gray-400'
                          : 'border-gray-100 text-gray-300 line-through cursor-not-allowed'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fabric */}
          {product.fabricType && (
            <p className="mt-4 text-xs text-muted">
              <span className="font-semibold uppercase tracking-widest text-primary">Fabric:</span> {product.fabricType}
            </p>
          )}

          {/* Variant Stock */}
          <p className="mt-3 text-xs text-muted">
            {selectedVariant
              ? selectedVariant.stock > 0
                ? `${selectedVariant.stock} in stock`
                : 'Out of stock for this variant'
              : sizes.length > 0 ? 'Select size & color' : `${product.totalStock} in stock`
            }
          </p>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => selectedVariant && addToCart(product.productId, selectedVariant.variantId)}
              disabled={!selectedVariant || selectedVariant.stock <= 0}
              className="flex flex-1 items-center justify-center gap-2 bg-primary py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-accent disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <FiShoppingBag size={16} />
              {!selectedVariant ? 'Select Options' : selectedVariant.stock <= 0 ? 'Out of Stock' : 'Add to Bag'}
            </button>
            <button className="flex h-[52px] w-[52px] items-center justify-center border border-gray-200 text-gray-400 transition hover:border-accent hover:text-accent">
              <FiHeart size={18} />
            </button>
          </div>

          {/* Details Accordion */}
          <div className="mt-10 space-y-4 border-t border-gray-100 pt-6">
            <details className="group">
              <summary className="cursor-pointer text-xs font-semibold uppercase tracking-widest text-primary">
                Product Details
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {product.productDescription || 'High-quality fabric. Designed for comfort and style.'}
              </p>
            </details>
            <details className="group">
              <summary className="cursor-pointer text-xs font-semibold uppercase tracking-widest text-primary">
                Care Instructions
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Machine wash cold. Tumble dry low. Do not bleach. Iron on low heat if needed.
              </p>
            </details>
            <details className="group">
              <summary className="cursor-pointer text-xs font-semibold uppercase tracking-widest text-primary">
                Shipping & Returns
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Free shipping on orders over ₹999. Easy 15-day returns & exchanges.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
