import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
    credentials: "include",
  }),
  tagTypes: ["Cart", "Category"],

  endpoints: (builder) => ({
    // GET http://localhost:8080/api/products?search=shirt
    searchProducts: builder.query<any, string>({
      query: (query) => `/api/products?search=${query}`,
    }),

    getProducts: builder.query<any, void>({
      query: () => "/api/products",
    }),

    getProductById: builder.query<any, void>({
      query: (product_id) => `/api/products/${product_id}`,
    }),

    createProduct: builder.mutation({
      query: (product) => ({
        url: "/api/products",
        method: "POST",
        body: product,
      }),
    }),

    // NEW: Add a mutation for adding items to the cart
    addToCart: builder.mutation({
      query: (cartItem: {
        productId: string;
        variantId: string;
        quantity: number;
      }) => ({
        url: "/api/cart",
        method: "POST",
        body: cartItem,
      }),
      invalidatesTags: ["Cart"],
    }),

    getCart: builder.query<any, void>({
      query: () => "/api/cart",
      providesTags: ["Cart"],
    }),

    checkout: builder.mutation({
      query: (order) => ({
        url: "/checkout",
        method: "POST",
        body: order,
      }),
    }),

    //
    createNewProduct: builder.mutation({
      query: (productFormData) => ({
        url: "/api/products",
        method: "POST",
        body: productFormData,
      }),
    }),

    createNewCategory: builder.mutation({
      query: (categoryName) => ({
        url: "/api/category",
        method: "POST",
        body: categoryName,
      }),
      invalidatesTags: ["Category"],
    }),

    getCategory: builder.query<any, void>({
      query: () => "/api/category",
      providesTags: ["Category"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useSearchProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useAddToCartMutation,
  useGetCartQuery,
  //
  useCreateNewCategoryMutation,
  useCreateNewProductMutation,
  useGetCategoryQuery,
} = productApi;
