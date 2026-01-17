import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
    credentials: "include",
  }),
  tagTypes: ["Cart", "Category"],

  endpoints: (builder) => ({
    searchProducts: builder.query<any, string>({
      query: (query) => `/api/products?search=${query}`,
    }),

    getStripeConfig: builder.query<{ publishableKey: string }, void>({
      query: () => "/api/checkout/config",
      transformResponse: (response: { data: { publishableKey: string } }) =>
        response.data,
    }),

    getProducts: builder.query<any, void>({
      query: () => "/api/products",
    }),

    getProductById: builder.query<any, string | undefined>({
      query: (product_id) => `/api/products/${product_id}`,
    }),

    createProduct: builder.mutation<any, any>({
      query: (product) => ({
        url: "/api/products",
        method: "POST",
        body: product,
      }),
    }),

    addToCart: builder.mutation<
      any,
      {
        productId: string;
        variantId: string;
        quantity: number;
      }
    >({
      query: (cartItem) => ({
        url: "/api/cart",
        method: "POST",
        body: cartItem,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeCartItem: builder.mutation<any, { removeCartItemId: string }>({
      query: (body) => ({
        url: "/api/cart",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation<
      any,
      { cartItemId: string; quantity: number }
    >({
      query: ({ cartItemId, quantity }) => ({
        url: "/api/cart/quantity",
        method: "PUT",
        body: { cartItemId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    getCart: builder.query<any, void>({
      query: () => "/api/cart",
      providesTags: ["Cart"],
    }),

    createPaymentIntent: builder.mutation<
      any,
      { shippingAddressId?: string; billingAddressId?: string }
    >({
      query: (body) => ({
        url: "/api/checkout/create-payment-intent",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),

    confirmPayment: builder.mutation<
      any,
      {
        paymentIntentId: string;
        shippingAddressId?: string;
        billingAddressId?: string;
      }
    >({
      query: (body) => ({
        url: "/api/checkout/confirm-payment",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),

    createNewProduct: builder.mutation<any, any>({
      query: (productFormData) => ({
        url: "/api/products",
        method: "POST",
        body: productFormData,
      }),
    }),

    createNewCategory: builder.mutation<any, any>({
      query: (categoryName) => ({
        url: "/api/category",
        method: "POST",
        body: categoryName,
      }),
      invalidatesTags: ["Category"],
    }),

    getCategory: builder.query<any, void>({
      query: () => "/api/category",
      transformResponse: (response: { data: any }) => response.data,
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
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
  useGetCartQuery,
  useCreateNewCategoryMutation,
  useCreateNewProductMutation,
  useGetCategoryQuery,
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
  useGetStripeConfigQuery,
} = productApi;
