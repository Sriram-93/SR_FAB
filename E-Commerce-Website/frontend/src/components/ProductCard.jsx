import { lazy, memo, Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart, FiBox } from "react-icons/fi";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { productByIdQueryOptions } from "../api/catalogQueries";
import { buildImageSrcSet, toOptimizedImageUrl } from "../utils/imageUtils";
import { FALLBACK_IMAGE } from "../utils/productImages";

// Lazy load the heavy 3D Modal component
const ModelViewerModal = lazy(() => import("./ModelViewerModal"));

// Curated Unsplash fashion photos keyed by category keyword
const ProductCard = ({ product, index = 0 }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [inWishlist, setInWishlist] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const modelStatus = String(
    product?.model3D?.generationStatus || "",
  ).toLowerCase();
  const hasReady3D = ["ready", "completed", "success"].includes(modelStatus);

  const colorMap = {
    black: "#1A1A1A",
    white: "#F7F7F7",
    navy: "#172554",
    blue: "#2563eb",
    sky: "#0ea5e9",
    olive: "#4d7c0f",
    green: "#10b981",
    maroon: "#7f1d1d",
    mustard: "#ca8a04",
    yellow: "#facc15",
    grey: "#6b7280",
    gray: "#6b7280",
    charcoal: "#374151",
    beige: "#d6c6a5",
    cream: "#f5f5dc",
    burgundy: "#7c2d12",
    khaki: "#a16207",
    brown: "#7c3f00",
    pink: "#ec4899",
    purple: "#8b5cf6",
  };

  // Use the image from the database, fallback to a category-aware or generic fallback if missing
  const rawImage =
    product.productImages || product.productImage || FALLBACK_IMAGE;
  const imgSrc = imageFailed
    ? FALLBACK_IMAGE
    : toOptimizedImageUrl(rawImage, { width: 640, height: 853 });
  const imgSrcSet = buildImageSrcSet(rawImage, "3:4");

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.info("Please sign in to save items");
      return;
    }
    setInWishlist(!inWishlist);
    toast.success(inWishlist ? "Removed from Wishlist" : "Added to Wishlist");
  };

  // Derive available sizes from variants
  const styleColors =
    product.styleColors?.length > 0
      ? product.styleColors
      : [...new Set(product.variants?.map((v) => v.color).filter(Boolean))];
  const styleColorCount = styleColors.length;

  const visibleSwatches = styleColors.slice(0, 5);

  const handleCardClick = () => {
    navigate(`/product/${product.productId}`);
  };

  const prefetchProductDetails = () => {
    queryClient.prefetchQuery(productByIdQueryOptions(product.productId));
  };

  return (
    <div
      className="group h-full animate-fade-in cursor-pointer"
      style={{ animationDelay: `${index * 0.07}s` }}
      onClick={handleCardClick}
      onMouseEnter={prefetchProductDetails}
      onFocus={prefetchProductDetails}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`View ${product.productName}`}
    >
      <article className="flex h-full flex-col rounded-none border border-primary/10 bg-surface transition duration-300 hover:border-primary/25">
        {/* Image Container */}
        <div className="relative block aspect-[3/4] overflow-hidden bg-surface">
          <img
            src={imgSrc}
            srcSet={imgSrcSet}
            sizes="(max-width: 768px) 46vw, (max-width: 1024px) 30vw, 22vw"
            alt={product.productName}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              setImageFailed(true);
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />

          {/* 3D Fit Check Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShow3D(true);
            }}
            className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-bg/85 shadow-md backdrop-blur-md transition hover:scale-105 hover:bg-bg"
            title={hasReady3D ? "Open 3D model" : "Open cube preview"}
            aria-label="Open 3D fit preview"
          >
            <FiBox size={17} className="text-primary" />
            <span
              className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border border-white ${
                hasReady3D ? "bg-emerald-500" : "bg-amber-400"
              }`}
            />
          </button>

          {/* Discount Badge */}
          {product.productDiscount > 0 && (
            <span className="absolute left-3 top-3 z-20 bg-accent px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-sm">
              -{product.productDiscount}%
            </span>
          )}

          {/* Quick View Overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-20 flex translate-y-full items-center justify-center gap-3 bg-bg/90 backdrop-blur-md py-4 transition-transform duration-300 group-hover:translate-y-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product.productId}`);
              }}
              className="flex items-center gap-2 bg-primary px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-bg transition hover:bg-accent"
            >
              Details
            </button>
            <button
              type="button"
              onClick={handleWishlist}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 text-primary transition hover:border-accent hover:text-accent hover:bg-accent/5"
              aria-label="Wishlist"
            >
              <FiHeart size={16} fill={inWishlist ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
          <div className="space-y-2">
            <p className="min-h-[14px] text-[9px] font-bold uppercase tracking-[0.2em] text-primary/55">
              {product.brand || "SR FAB"}
            </p>
            <h3 className="line-clamp-2 min-h-[2.8rem] text-sm font-semibold leading-5 text-primary transition group-hover:text-accent">
              {product.productName}
            </h3>
          </div>

          <div className="mt-3 min-h-[22px]">
            {styleColorCount > 1 ? (
              <div className="flex items-center gap-1.5">
                {visibleSwatches.map((color) => {
                  const token = color?.toLowerCase() || "";
                  const bg = colorMap[token] || "#d1d5db";
                  return (
                    <span
                      key={color}
                      className="h-3.5 w-3.5 rounded-full border border-primary/20"
                      style={{ backgroundColor: bg }}
                      title={color}
                    />
                  );
                })}
                {styleColorCount > visibleSwatches.length && (
                  <span className="text-[9px] font-semibold uppercase tracking-wide text-primary/45">
                    +{styleColorCount - visibleSwatches.length}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-[9px] font-semibold uppercase tracking-wide text-primary/35">
                Single color
              </span>
            )}
          </div>

          <div className="mt-auto flex min-h-[26px] items-end gap-2 pt-4">
            <span className="text-base font-black text-primary">
              ₹{product.productPriceAfterDiscount || product.productPrice}
            </span>
            {product.productDiscount > 0 && (
              <span className="text-[11px] font-medium text-primary/40 line-through">
                ₹{product.productPrice}
              </span>
            )}
          </div>
        </div>
      </article>

      {/* Render the immersive 3D Modal if show3D is true (Lazy Loaded) */}
      <Suspense fallback={<div className="sr-only">Loading model preview</div>}>
        {show3D && (
          <ModelViewerModal
            product={product}
            isOpen={show3D}
            onClose={() => setShow3D(false)}
          />
        )}
      </Suspense>
    </div>
  );
};

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.index === nextProps.index &&
    prevProps.product?.productId === nextProps.product?.productId &&
    prevProps.product?.productPriceAfterDiscount ===
      nextProps.product?.productPriceAfterDiscount &&
    prevProps.product?.productPrice === nextProps.product?.productPrice &&
    prevProps.product?.productDiscount === nextProps.product?.productDiscount &&
    prevProps.product?.productImages === nextProps.product?.productImages &&
    prevProps.product?.model3D?.generationStatus ===
      nextProps.product?.model3D?.generationStatus &&
    prevProps.product?.model3D?.modelUrl ===
      nextProps.product?.model3D?.modelUrl
  );
};

const MemoizedProductCard = memo(ProductCard, areEqual);
MemoizedProductCard.displayName = "ProductCard";

export default MemoizedProductCard;
