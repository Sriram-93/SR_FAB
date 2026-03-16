import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiChevronLeft, FiHeart, FiShoppingBag } from "react-icons/fi";
import { useGLTF } from "@react-three/drei";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import ProductDetailsSkeleton from "../components/skeletons/ProductDetailsSkeleton";
import QueryErrorState from "../components/QueryErrorState";
import { useProductByIdQuery, useProductsQuery } from "../api/catalogQueries";
import {
  fetchModelGenerationStatus,
  triggerModelGeneration,
} from "../api/modelApi";
import {
  groupProductsByStyle,
  toBaseProductName,
} from "../utils/productGrouping";
import { buildImageSrcSet, toOptimizedImageUrl } from "../utils/imageUtils";
import { FALLBACK_IMAGE } from "../utils/productImages";
import { usePageSeo } from "../hooks/usePageSeo";

const ModelViewerModal = lazy(() => import("../components/ModelViewerModal"));
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

  const [selectionByProduct, setSelectionByProduct] = useState({});
  const [show3D, setShow3D] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);
  const [imageErrorByProduct, setImageErrorByProduct] = useState({});
  const [generationStatus, setGenerationStatus] = useState("not_started");
  const [isGeneratingModel, setIsGeneratingModel] = useState(false);

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useProductByIdQuery(id);

  const { data: allProducts = [] } = useProductsQuery();

  useEffect(() => {
    const status = product?.model3D?.generationStatus;
    setGenerationStatus(status || "not_started");
    
    // Preload model if available
    const modelUrl = product?.model3D?.modelUrl || product?.modelUrl;
    if (modelUrl) {
      useGLTF.preload(modelUrl);
    }
  }, [product]);

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

  const styleFamily = useMemo(() => {
    if (!product || allProducts.length === 0) return [product].filter(Boolean);

    const baseName = toBaseProductName(product.productName || "").toLowerCase();
    const categoryId = product?.category?.categoryId;

    const family = allProducts.filter((item) => {
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
    return groupProductsByStyle(allProducts)
      .filter(
        (item) =>
          item.category?.categoryId === product.category.categoryId &&
          item.productId !== product.productId &&
          toBaseProductName(item.productName || "").toLowerCase() !== styleName,
      )
      .slice(0, 4);
  }, [allProducts, product]);

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

  const canGenerateModel = user?.role === "ROLE_ADMIN";
  const sourceImageUrl =
    product?.productImages || product?.productImage || FALLBACK_IMAGE;

  const pollModelJob = async (jobId) => {
    // Poll until generation is complete/fails, then refresh product model metadata.
    for (let attempt = 0; attempt < 30; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      const data = await fetchModelGenerationStatus(jobId);
      const status = String(data?.status || "").toLowerCase();
      if (status) setGenerationStatus(status);

      if (status === "completed") {
        await refetch();
        setGenerationStatus("ready");
        toast.success("3D model generated successfully");
        return true;
      }

      if (status === "failed") {
        await refetch();
        toast.error(data?.error || "3D generation failed");
        return false;
      }
    }

    toast.info("3D generation is still processing. Check again shortly.");
    return false;
  };

  const handleGenerate3D = async () => {
    if (!canGenerateModel) {
      toast.info("Only admin can generate 3D models");
      return;
    }

    if (!sourceImageUrl) {
      toast.error("No source image found for this product");
      return;
    }

    try {
      setIsGeneratingModel(true);
      setGenerationStatus("queued");

      const payload = await triggerModelGeneration({
        productId: product.productId,
        sourceImageUrl,
        prompt: `${product.productName} high quality apparel 3d model`,
      });

      const status = String(payload?.status || "processing").toLowerCase();
      const jobId = payload?.jobId;
      setGenerationStatus(status);

      if (!jobId) {
        throw new Error("Missing generation job id");
      }

      toast.info("3D generation started. This can take a minute.");
      await pollModelJob(jobId);
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Unable to start 3D generation";
      toast.error(message);
      setGenerationStatus("failed");
    } finally {
      setIsGeneratingModel(false);
    }
  };

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
    { width: 900, height: 1125 },
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
          onClick={() => setShow3D(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setShow3D(true);
            }
          }}
          aria-label={`Open 3D preview for ${product.productName}`}
        >
          <img
            src={primaryImage}
            srcSet={buildImageSrcSet(
              product.productImages || product.productImage,
              "4:5",
            )}
            sizes="(max-width: 768px) 92vw, 44vw"
            alt={product.productName}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
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
              className="flex h-[60px] w-[60px] items-center justify-center border border-primary/10 text-primary transition-all duration-300 hover:border-accent hover:bg-accent/5 hover:text-accent"
              aria-label="Save to wishlist"
            >
              <FiHeart size={20} />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowTryOn(true)}
              className="border border-accent/30 bg-accent/10 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-accent transition hover:bg-accent/20"
            >
              Try On (Webcam / Selfie)
            </button>

            <button
              type="button"
              onClick={handleGenerate3D}
              disabled={!canGenerateModel || isGeneratingModel}
              className="border border-primary/20 bg-primary/5 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-primary transition hover:border-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGeneratingModel
                ? "Generating 3D..."
                : "Generate 3D from Image"}
            </button>

            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">
              3D Status: {generationStatus.replaceAll("_", " ")}
            </span>
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
        {show3D && (
          <ModelViewerModal
            product={product}
            isOpen={show3D}
            onClose={() => setShow3D(false)}
          />
        )}
      </Suspense>

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
