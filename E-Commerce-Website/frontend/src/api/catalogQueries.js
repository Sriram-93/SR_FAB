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
  categories: () => [...catalogQueryKeys.all, "categories"],
  product: (id) => [...catalogQueryKeys.all, "product", String(id)],
};

const fetchProducts = async () => {
  const { data } = await api.get("/products");
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

export const categoriesQueryOptions = () =>
  queryOptions({
    queryKey: catalogQueryKeys.categories(),
    queryFn: fetchCategories,
    staleTime: TEN_MINUTES,
    gcTime: TEN_MINUTES,
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

export const useCategoriesQuery = () => useQuery(categoriesQueryOptions());

export const useProductByIdQuery = (id) =>
  useQuery(productByIdQueryOptions(id));
