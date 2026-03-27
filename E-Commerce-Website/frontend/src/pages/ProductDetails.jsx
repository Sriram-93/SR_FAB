import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiChevronLeft, FiHeart, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import ProductDetailsSkeleton from "../components/skeletons/ProductDetailsSkeleton";
import QueryErrorState from "../components/QueryErrorState";
import {
  useProductByIdQuery,
  useRelatedProductsQuery,
  useProductsQuery,
} from "../api/catalogQueries";
import {
  groupProductsByStyle,
  toBaseProductName,
} from "../utils/productGrouping";
import { buildImageSrcSet, toOptimizedImageUrl } from "../utils/imageUtils";
import { FALLBACK_IMAGE } from "../utils/productImages";
import { usePageSeo } from "../hooks/usePageSeo";

const VirtualTryOnModal = lazy(() => import("../components/VirtualTryOnModal"));

const getPrimaryColor = (product) => {
  const inStockVariant = product?.variants?.find(
    (variant) => (variant?.stock || 0) > 0,
  );
  if (inStockVariant?.color) return inStockVariant.color;
  return product?.variants?.[0]?.color || "";
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist, isWishlistPending } = useWishlist();

  const [selectionByProduct, setSelectionByProduct] = useState({});
  const [showTryOn, setShowTryOn] = useState(false);
  const [imageErrorByProduct, setImageErrorByProduct] = useState({});

  const {
    data: product,
    isLoading: isProductLoading,
    isError,
    refetch,
  } = useProductByIdQuery(id);
  const isAdmin = user?.role === "ROLE_ADMIN";
  const wishlistPending = product
    ? isWishlistPending(product.productId)
    : false;

  const { data: relatedProductsRaw = [] } = useRelatedProductsQuery({
    productId: product?.productId,
    categoryId: product?.category?.categoryId,
    limit: 16,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  usePageSeo({
    title: product
      ? `${product.productName} | SR FAB Premium Collection`
      : "Product | SR FAB",
    description:
      product?.productDescription ||
      "Explore premium details, sizing, and rich visuals for SR FAB products.",
    image: toOptimizedImageUrl(
      product?.productImages || product?.productImage || FALLBACK_IMAGE,
      { width: 1200, height: 1500 },
    ),
    url: `${window.location.origin}/product/${id}`,
  });

  const isLoading = isProductLoading;
  
  const { data: allProducts = [] } = useProductsQuery();
  
  const styleFamily = useMemo(() => {
    if (!product) return [];
    
    const candidates = allProducts.length > 0 ? allProducts : [product];
    const baseName = toBaseProductName(product.productName || "").toLowerCase();
    const categoryId = product?.category?.categoryId;

    const family = candidates.filter((item) => {
      const sameBaseName =
        toBaseProductName(item.productName || "").toLowerCase() === baseName;
      const sameCategory = item?.category?.categoryId === categoryId;
      return sameBaseName && sameCategory;
    });

    return family.length > 0 ? family : [product];
  }, [product, allProducts]);

  const familyColors = useMemo(() => {
    const colorMap = new Map();
    styleFamily.forEach((item) => {
      const color = getPrimaryColor(item);
      if (color && !colorMap.has(color.toLowerCase())) {
        colorMap.set(color.toLowerCase(), {
          color,
          productId: item.productId,
        });
      }
    });
    return Array.from(colorMap.values());
  }, [styleFamily]);

  const relatedProducts = useMemo(() => {
    if (!product?.category?.categoryId) return [];

    const styleName = toBaseProductName(
      product.productName || "",
    ).toLowerCase();
    return groupProductsByStyle(relatedProductsRaw)
      .filter(
        (item) =>
          item.category?.categoryId === product.category.categoryId &&
          item.productId !== product.productId &&
          toBaseProductName(item.productName || "").toLowerCase() !== styleName,
      )
      .slice(0, 4);
  }, [product, relatedProductsRaw]);

  const sizes = useMemo(
    () => [
      ...new Set(
        product?.variants?.map((variant) => variant.size).filter(Boolean),
      ),
    ],
    [product],
  );

  const colors = useMemo(() => {
    if (familyColors.length > 0) {
      return familyColors.map((item) => item.color);
    }
    return [
      ...new Set(
        product?.variants?.map((variant) => variant.color).filter(Boolean),
      ),
    ];
  }, [familyColors, product]);

  const selection = selectionByProduct[id] || {};
  const selectedSize = selection.size || sizes[0] || "";

  const colorsForSize = useMemo(
    () => [
      ...new Set(
        product?.variants
          ?.filter((variant) => variant.size === selectedSize)
          .map((variant) => variant.color)
          .filter(Boolean),
      ),
    ],
    [product, selectedSize],
  );

  const selectedColor =
    selection.color ||
    colorsForSize[0] ||
    colors[0] ||
    product?.variants?.[0]?.color ||
    "";

  const selectedVariant = useMemo(() => {
    return (
      product?.variants?.find(
        (variant) =>
          variant.size === selectedSize && variant.color === selectedColor,
      ) || null
    );
  }, [product, selectedColor, selectedSize]);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="py-10">
        <QueryErrorState
          title="Product unavailable"
          message="This product could not be loaded right now. Please retry."
          onRetry={refetch}
        />
      </div>
    );
  }

  const imageFailed = Boolean(imageErrorByProduct[id]);
  const primaryImage = toOptimizedImageUrl(
    imageFailed
      ? FALLBACK_IMAGE
      : product.productImages || product.productImage || FALLBACK_IMAGE,
    { width: 800, height: 1000, quality: 72 },
  );

  return (
    <div className="animate-fade-in py-10">
      <Link
        to="/shop"
        className="mb-8 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-widest text-muted transition hover:text-primary"
      >
        <FiChevronLeft size={14} /> Back to collections
      </Link>

      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        <div
          className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-2xl border border-primary/5 bg-surface shadow-sm"
          aria-label={product.productName}
        >
          <img
            src={primaryImage}
            srcSet={buildImageSrcSet(
              product.productImages || product.productImage,
              "4:5",
            )}
            sizes="(max-width: 768px) 92vw, (max-width: 1280px) 48vw, 44vw"
            alt={product.productName}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onError={() => {
              setImageErrorByProduct((prev) => ({ ...prev, [id]: true }));
            }}
          />
        </div>

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
            {toBaseProductName(product.productName || "")}
          </h1>

          <p className="mt-4 leading-relaxed text-muted">
            {product.productDescription ||
              "Premium quality garment crafted with attention to detail and comfort."}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-2xl font-bold text-primary">
              ₹{product.productPriceAfterDiscount || product.productPrice}
            </span>
            {product.productDiscount > 0 && (
              <>
                <span className="text-lg text-muted line-through">
                  ₹{product.productPrice}
                </span>
                <span className="rounded bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent">
                  {product.productDiscount}% OFF
                </span>
              </>
            )}
          </div>

          {colors.length > 0 && (
            <div className="mt-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Color -{" "}
                <span className="font-normal text-muted">{selectedColor}</span>
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {colors.map((color) => {
                  const colorProduct = familyColors.find(
                    (item) => item.color.toLowerCase() === color.toLowerCase(),
                  );
                  const isAvailable =
                    familyColors.length > 0
                      ? Boolean(colorProduct)
                      : !selectedSize || colorsForSize.includes(color);

                  return (
                    <button
                      type="button"
                      key={color}
                      onClick={() => {
                        if (
                          colorProduct &&
                          colorProduct.productId !== product.productId
                        ) {
                          navigate(`/product/${colorProduct.productId}`);
                          return;
                        }
                        setSelectionByProduct((prev) => ({
                          ...prev,
                          [id]: { ...prev[id], color },
                        }));
                      }}
                      disabled={!isAvailable}
                      className={`min-w-[60px] border px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition duration-300 ${
                        selectedColor === color
                          ? "border-primary bg-primary text-bg"
                          : isAvailable
                            ? "border-primary/10 text-primary/60 hover:border-accent hover:text-accent"
                            : "cursor-not-allowed border-primary/5 text-primary/20"
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mt-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Size
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const variantsForSize = product.variants.filter(
                    (variant) => variant.size === size,
                  );
                  const hasStock = variantsForSize.some(
                    (variant) => variant.stock > 0,
                  );

                  return (
                    <button
                      type="button"
                      key={size}
                      onClick={() => {
                        setSelectionByProduct((prev) => ({
                          ...prev,
                          [id]: { ...prev[id], size },
                        }));
                      }}
                      disabled={!hasStock}
                      className={`min-w-[44px] border px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition duration-300 ${
                        selectedSize === size
                          ? "border-primary bg-primary text-bg"
                          : hasStock
                            ? "border-primary/10 text-primary/60 hover:border-accent hover:text-accent"
                            : "cursor-not-allowed border-primary/5 text-primary/20 line-through"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <p className="mt-3 text-xs text-muted">
            {selectedVariant
              ? selectedVariant.stock > 0
                ? `${selectedVariant.stock} in stock`
                : "Out of stock for this variant"
              : sizes.length > 0
                ? "Select size and color"
                : `${product.totalStock} in stock`}
          </p>

          {!isAdmin ? (
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() =>
                  selectedVariant &&
                  addToCart(product.productId, selectedVariant.variantId)
                }
                disabled={!selectedVariant || selectedVariant.stock <= 0}
                className="flex flex-1 items-center justify-center gap-2 bg-primary py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-bg transition-all duration-300 hover:-translate-y-1 hover:bg-accent hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:bg-primary/20 disabled:text-primary/40"
              >
                <FiShoppingBag size={16} />
                {!selectedVariant
                  ? "Select Options"
                  : selectedVariant.stock <= 0
                    ? "Out of Stock"
                    : "Add to Bag"}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.productId)}
                disabled={wishlistPending}
                className="flex h-[60px] w-[60px] items-center justify-center border border-primary/10 text-primary transition-all duration-300 hover:border-accent hover:bg-accent/5 hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Save to wishlist"
              >
                <FiHeart
                  size={20}
                  fill={isInWishlist(product.productId) ? "currentColor" : "none"}
                  className={isInWishlist(product.productId) ? "text-accent" : ""}
                />
              </button>
            </div>
          ) : (
            <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-primary/50">
              Customer actions are hidden for admin accounts.
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowTryOn(true)}
              className="group relative border border-accent/40 bg-accent/10 px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-accent transition-all hover:bg-accent/20 hover:shadow-[0_0_20px_rgba(252,163,17,0.2)] active:scale-95"
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                </span>
                AI Virtual Try-On
              </div>
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-primary/5 pt-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                Personalized Selection
              </span>
              <h2 className="mt-1 font-serif text-3xl font-bold text-primary sm:text-4xl">
                You May Also Like
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-[10px] font-bold uppercase tracking-widest text-primary/40 transition hover:text-accent"
            >
              Explore All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {relatedProducts.map((item, index) => (
              <ProductCard key={item.productId} product={item} index={index} />
            ))}
          </div>
        </section>
      )}

      <Suspense fallback={null}>
        {showTryOn && (
          <VirtualTryOnModal
            product={product}
            isOpen={showTryOn}
            onClose={() => setShowTryOn(false)}
          />
        )}
      </Suspense>
    </div>
  );
};

export default ProductDetails;
