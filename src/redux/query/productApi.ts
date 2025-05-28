import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Produts = {
  id: number;
  title: string;
  description: string;
  price: number;
  inStock: number;
  category: string;
  stockId: number;
  userId: number;
  createAt: Date;
  updateAt: Date;
};

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
    credentials: "include",
  }),

  endpoints: (builder) => ({
    // getProducts: builder.query<Produts[], void>({
    getProducts: builder.query<{ data: Produts[] }, void>({
      query: () => "/api/products",
    }),

    getProductById: builder.query({
      query: (id) => `/api/products/${id}`,
    }),

    createNewProduct: builder.mutation({
      query: (productFormData) => ({
        url: "/api/products",
        method: "POST",
        body: productFormData,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateNewProductMutation,
} = productApi;
