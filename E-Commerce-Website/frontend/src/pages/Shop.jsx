import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiChevronLeft, FiSearch } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import ProductGridSkeleton from "../components/skeletons/ProductGridSkeleton";
import QueryErrorState from "../components/QueryErrorState";
import { groupProductsByStyle } from "../utils/productGrouping";
import { useCategoriesQuery, useProductsQuery } from "../api/catalogQueries";
import { usePageSeo } from "../hooks/usePageSeo";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("featured");

  const selectedCat = searchParams.get("categoryId") || "all";
  const searchQueryRaw = searchParams.get("search") || "";
  const searchQuery = searchQueryRaw.toLowerCase();

  const {
    data: products = [],
    isLoading: isProductsLoading,
    isError: productsError,
    refetch: refetchProducts,
  } = useProductsQuery();

  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: categoriesError,
    refetch: refetchCategories,
  } = useCategoriesQuery();

  usePageSeo({
    title: "Shop Premium Collections | SR FAB",
    description:
      "Explore premium cotton collections with fast browsing, smart filtering, and rich product previews.",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=630&fit=crop&q=80",
    url: `${window.location.origin}/shop`,
  });

  const styleProducts = useMemo(
    () => groupProductsByStyle(products),
    [products],
  );

  const filtered = useMemo(() => {
    return styleProducts.filter((product) => {
      const matchesCat =
        selectedCat === "all" ||
        product.category?.categoryId === Number.parseInt(selectedCat, 10);

      const matchesSearch =
        !searchQuery ||
        product.productName?.toLowerCase().includes(searchQuery) ||
        product.brand?.toLowerCase().includes(searchQuery) ||
        product.productDescription?.toLowerCase().includes(searchQuery) ||
        product.styleColors?.some((color) =>
          color.toLowerCase().includes(searchQuery),
        );

      return matchesCat && matchesSearch;
    });
  }, [styleProducts, selectedCat, searchQuery]);

  const sortedProducts = useMemo(() => {
    const cloned = [...filtered];

    if (sortBy === "price-asc") {
      cloned.sort(
        (a, b) =>
          (a.productPriceAfterDiscount || a.productPrice || 0) -
          (b.productPriceAfterDiscount || b.productPrice || 0),
      );
    } else if (sortBy === "price-desc") {
      cloned.sort(
        (a, b) =>
          (b.productPriceAfterDiscount || b.productPrice || 0) -
          (a.productPriceAfterDiscount || a.productPrice || 0),
      );
    } else if (sortBy === "discount") {
      cloned.sort(
        (a, b) => (b.productDiscount || 0) - (a.productDiscount || 0),
      );
    }

    return cloned;
  }, [filtered, sortBy]);

  const isLoading = isProductsLoading || isCategoriesLoading;
  const hasError = productsError || categoriesError;

  if (hasError) {
    return (
      <div className="animate-fade-in py-10">
        <QueryErrorState
          title="Catalog failed to load"
          message="We are having trouble loading the catalog. Please retry in a moment."
          onRetry={() => {
            refetchProducts();
            refetchCategories();
          }}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in py-10">
      <div className="mb-10 border-b border-primary/10 pb-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <Link
              to="/"
              className="mb-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-accent transition hover:text-primary"
            >
              <FiChevronLeft size={14} /> Home
            </Link>
            <h1 className="font-serif text-3xl font-bold text-primary sm:text-4xl">
              {searchQuery ? `Search: "${searchQuery}"` : "All Collections"}
            </h1>
            <p className="mt-1 text-sm font-medium text-muted">
              {sortedProducts.length} products
            </p>
          </div>

          <div className="grid w-full gap-4 md:w-[420px] md:grid-cols-[1fr_auto]">
            <label className="flex items-center gap-2 border border-primary/15 bg-surface px-3 py-2 text-xs">
              <FiSearch className="text-primary/50" aria-hidden="true" />
              <input
                type="search"
                value={searchQueryRaw}
                onChange={(event) => {
                  const next = new URLSearchParams(searchParams);
                  const nextValue = event.target.value.trimStart();
                  if (nextValue) {
                    next.set("search", nextValue);
                  } else {
                    next.delete("search");
                  }
                  setSearchParams(next, { replace: true });
                }}
                placeholder="Search by product, brand, color"
                className="w-full bg-transparent text-xs font-semibold tracking-wide text-primary outline-none placeholder:text-primary/35"
                aria-label="Search products"
              />
            </label>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="w-full border border-primary/15 bg-surface px-4 py-3 text-xs font-semibold uppercase tracking-wide text-primary outline-none transition hover:border-primary/30 focus:border-accent"
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Discount</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => {
              const next = new URLSearchParams(searchParams);
              next.delete("categoryId");
              setSearchParams(next, { replace: true });
            }}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition ${
              selectedCat === "all"
                ? "bg-primary text-bg"
                : "border border-primary/15 text-primary/55 hover:border-accent hover:text-accent"
            }`}
          >
            All Collections
          </button>
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.categoryId}
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.set("categoryId", String(cat.categoryId));
                setSearchParams(next, { replace: true });
              }}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition ${
                selectedCat === String(cat.categoryId)
                  ? "bg-primary text-bg"
                  : "border border-primary/15 text-primary/55 hover:border-accent hover:text-accent"
              }`}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : sortedProducts.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <p className="text-lg font-medium text-primary">No products found</p>
          <p className="mt-2 text-sm text-muted">
            Try a different keyword or category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {sortedProducts.map((product, index) => (
            <div key={product.productId} className="h-full">
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
