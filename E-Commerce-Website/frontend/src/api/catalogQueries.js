import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import api from "./axios";

const ONE_MINUTE = 60 * 1000;
const TEN_MINUTES = 10 * 60 * 1000;

export const catalogQueryKeys = {
  all: ["catalog"],
  products: () => [...catalogQueryKeys.all, "products"],
  productsPage: ({ page = 0, size = 20, categoryId, search, sortBy } = {}) => [
    ...catalogQueryKeys.all,
    "products-page",
    page,
    size,
    categoryId ?? "all",
    search ?? "",
    sortBy ?? "featured",
  ],
  trending: ({ limit = 8 } = {}) => [
    ...catalogQueryKeys.all,
    "trending",
    limit,
  ],
  related: ({ productId, categoryId, limit = 8 } = {}) => [
    ...catalogQueryKeys.all,
    "related",
    productId ?? "none",
    categoryId ?? "none",
    limit,
  ],
  categories: () => [...catalogQueryKeys.all, "categories"],
  product: (id) => [...catalogQueryKeys.all, "product", String(id)],
};

const fetchProducts = async () => {
  const { data } = await api.get("/products");
  return data || [];
};

const fetchProductsPage = async ({
  page = 0,
  size = 20,
  categoryId,
  search,
  sortBy = "featured",
} = {}) => {
  const params = {
    page,
    size,
    sortBy,
    ...(categoryId ? { categoryId } : {}),
    ...(search ? { search } : {}),
  };

  const { data } = await api.get("/products/paged", { params });
  return (
    data || {
      content: [],
      page,
      size,
      totalElements: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    }
  );
};

const fetchTrendingProducts = async ({ limit = 8 } = {}) => {
  const { data } = await api.get("/products/trending", { params: { limit } });
  return data || [];
};

const fetchRelatedProducts = async ({
  productId,
  categoryId,
  limit = 8,
} = {}) => {
  if (!productId || !categoryId) return [];

  const { data } = await api.get("/products/related", {
    params: { productId, categoryId, limit },
  });

  return data || [];
};

const fetchCategories = async () => {
  const { data } = await api.get("/categories");
  return data || [];
};

const fetchProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const productsQueryOptions = () =>
  queryOptions({
    queryKey: catalogQueryKeys.products(),
    queryFn: fetchProducts,
    staleTime: ONE_MINUTE,
    gcTime: TEN_MINUTES,
    placeholderData: keepPreviousData,
  });

export const productsPageQueryOptions = (params = {}) =>
  queryOptions({
    queryKey: catalogQueryKeys.productsPage(params),
    queryFn: () => fetchProductsPage(params),
    staleTime: ONE_MINUTE,
    gcTime: TEN_MINUTES,
    placeholderData: keepPreviousData,
  });

export const categoriesQueryOptions = () =>
  queryOptions({
    queryKey: catalogQueryKeys.categories(),
    queryFn: fetchCategories,
    staleTime: TEN_MINUTES,
    gcTime: TEN_MINUTES,
  });

export const trendingProductsQueryOptions = (params = {}) =>
  queryOptions({
    queryKey: catalogQueryKeys.trending(params),
    queryFn: () => fetchTrendingProducts(params),
    staleTime: ONE_MINUTE,
    gcTime: TEN_MINUTES,
    placeholderData: keepPreviousData,
  });

export const relatedProductsQueryOptions = (params = {}) =>
  queryOptions({
    queryKey: catalogQueryKeys.related(params),
    queryFn: () => fetchRelatedProducts(params),
    staleTime: ONE_MINUTE,
    gcTime: TEN_MINUTES,
    enabled: Boolean(params?.productId && params?.categoryId),
    placeholderData: keepPreviousData,
  });

export const productByIdQueryOptions = (id) =>
  queryOptions({
    queryKey: catalogQueryKeys.product(id),
    queryFn: () => fetchProductById(id),
    staleTime: ONE_MINUTE,
    gcTime: TEN_MINUTES,
    enabled: Boolean(id),
  });

export const useProductsQuery = () => useQuery(productsQueryOptions());

export const useProductsPageQuery = (params = {}) =>
  useQuery(productsPageQueryOptions(params));

export const useTrendingProductsQuery = (params = {}) =>
  useQuery(trendingProductsQueryOptions(params));

export const useRelatedProductsQuery = (params = {}) =>
  useQuery(relatedProductsQueryOptions(params));

export const useCategoriesQuery = () => useQuery(categoriesQueryOptions());

export const useProductByIdQuery = (id) =>
  useQuery(productByIdQueryOptions(id));
