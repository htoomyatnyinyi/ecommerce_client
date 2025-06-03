import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getProducts: builder.query({
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

    getCart: builder.query<CartItem[], { userId: string }>({
      query: ({ userId }) => `/api/cart/${userId}`,
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation({
      query: ({ userId, productId, variantId, quantity }) => ({
        url: "/api/cart/add",
        method: "POST",
        body: { userId, productId, variantId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation({
      query: ({ userId, productId, variantId, quantity }) => ({
        url: "/api/cart/update",
        method: "PUT",
        body: { userId, productId, variantId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation({
      query: ({ userId, productId, variantId }) => ({
        url: "/api/cart/remove",
        method: "DELETE",
        body: { userId, productId, variantId },
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation({
      query: ({ userId }) => ({
        url: "/api/cart/clear",
        method: "DELETE",
        body: { userId },
      }),
      invalidatesTags: ["Cart"],
    }),

    createOrder: builder.mutation({
      query: ({ userId }) => ({
        url: "/api/orders",
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateNewProductMutation,
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useCreateOrderMutation,
} = productApi;
