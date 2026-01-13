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

    checkout: builder.mutation<any, any>({
      query: (order) => ({
        url: "/checkout",
        method: "POST",
        body: order,
      }),
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
} = productApi;
