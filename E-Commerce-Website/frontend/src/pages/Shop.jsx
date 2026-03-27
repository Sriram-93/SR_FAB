import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiChevronLeft, FiSearch } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import ProductCard from "../components/ProductCard";
import ProductGridSkeleton from "../components/skeletons/ProductGridSkeleton";
import QueryErrorState from "../components/QueryErrorState";
import { groupProductsByStyle } from "../utils/productGrouping";
import {
  productsPageQueryOptions,
  useCategoriesQuery,
  useProductsPageQuery,
} from "../api/catalogQueries";
import { usePageSeo } from "../hooks/usePageSeo";

const PAGE_SIZE = 20;

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("featured");
  const queryClient = useQueryClient();

  const selectedCat = searchParams.get("categoryId") || "all";
  const searchQueryRaw = searchParams.get("search") || "";
  const searchQuery = searchQueryRaw.toLowerCase();
  const currentPage = Math.max(
    0,
    Number.parseInt(searchParams.get("page") || "1", 10) - 1,
  );

  const {
    data: pageData,
    isLoading: isProductsLoading,
    isError: productsError,
    refetch: refetchProducts,
  } = useProductsPageQuery({
    page: currentPage,
    size: PAGE_SIZE,
    sortBy,
    categoryId:
      selectedCat === "all" ? undefined : Number.parseInt(selectedCat, 10),
    search: searchQueryRaw.trim() || undefined,
  });

  const products = pageData?.content || [];

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
      "https://res.cloudinary.com/de5x4aaqj/image/upload/v1774547905/sr-fab/site-assets/gen-3bda373a-ed64-4e44-8a05-7e48c2419dc5.jpg",
    url: `${window.location.origin}/shop`,
  });

  const isLoading = isProductsLoading || isCategoriesLoading;
  const hasError = productsError || categoriesError;

  useEffect(() => {
    if (!pageData?.hasNext) return;

    queryClient.prefetchQuery(
      productsPageQueryOptions({
        page: currentPage + 1,
        size: PAGE_SIZE,
        sortBy,
        categoryId:
          selectedCat === "all" ? undefined : Number.parseInt(selectedCat, 10),
        search: searchQueryRaw.trim() || undefined,
      }),
    );
  }, [
    currentPage,
    pageData?.hasNext,
    queryClient,
    searchQueryRaw,
    selectedCat,
    sortBy,
  ]);

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
              {pageData?.totalElements || 0} products
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row lg:w-[420px]">
            <label className="flex flex-1 items-center gap-2 border border-primary/10 bg-surface/50 px-3 py-2.5 text-xs transition-focus focus-within:border-accent md:py-2">
              <FiSearch className="text-primary/40" aria-hidden="true" />
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
                  next.set("page", "1");
                  setSearchParams(next, { replace: true });
                }}
                placeholder="Search products..."
                className="w-full bg-transparent text-[11px] font-bold uppercase tracking-wider text-primary outline-none placeholder:text-primary/25 md:text-xs"
                aria-label="Search products"
              />
            </label>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="w-full border border-primary/10 bg-surface/50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-primary outline-none transition hover:border-primary/25 focus:border-accent md:w-44 md:py-2"
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Discount</option>
            </select>
          </div>
        </div>

        <div className="no-scrollbar mt-8 flex flex-nowrap gap-2 overflow-x-auto pb-2 md:mt-6 md:flex-wrap md:overflow-visible md:pb-0">
          <button
            type="button"
            onClick={() => {
              const next = new URLSearchParams(searchParams);
              next.delete("categoryId");
              next.set("page", "1");
              setSearchParams(next, { replace: true });
            }}
            className={`whitespace-nowrap px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all sm:px-4 sm:py-2 ${
              selectedCat === "all"
                ? "bg-primary text-bg shadow-lg shadow-primary/10"
                : "border border-primary/10 bg-surface/30 text-primary/50 hover:border-accent hover:text-accent"
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
                next.set("page", "1");
                setSearchParams(next, { replace: true });
              }}
              className={`whitespace-nowrap px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all sm:px-4 sm:py-2 ${
                selectedCat === String(cat.categoryId)
                  ? "bg-primary text-bg shadow-lg shadow-primary/10"
                  : "border border-primary/10 bg-surface/30 text-primary/50 hover:border-accent hover:text-accent"
              }`}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : products.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <p className="text-lg font-medium text-primary">No products found</p>
          <p className="mt-2 text-sm text-muted">
            Try a different keyword or category.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
            {products.map((product, index) => (
              <div key={product.productId} className="h-full">
                <ProductCard product={product} index={index} />
              </div>
            ))}
          </div>

          {(pageData?.totalPages || 0) > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={!pageData?.hasPrevious}
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.set("page", String(currentPage));
                  setSearchParams(next, { replace: true });
                }}
                className="border border-primary/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-primary transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-primary/60">
                Page {currentPage + 1} of {pageData?.totalPages}
              </span>

              <button
                type="button"
                disabled={!pageData?.hasNext}
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.set("page", String(currentPage + 2));
                  setSearchParams(next, { replace: true });
                }}
                className="border border-primary/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-primary transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Shop;
