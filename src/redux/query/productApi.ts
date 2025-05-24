// src/features/productApi.js
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
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }), // Replace with your API
  endpoints: (builder) => ({
    getProducts: builder.query<Produts[], void>({
      query: () => "/api/products",
    }),

    getProductById: builder.query({
      query: (id) => `/api/products/${id}`,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productApi;
