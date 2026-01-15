import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface VariantOption {
  id: string;
  attributeName: string;
  attributeValue: string;
  variantId: string;
}

export interface Variant {
  id: string;
  sku: string;
  price: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
  productId: string;
  variantOptions: VariantOption[];
}

export interface Image {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  productId: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updateAt: string;
  userId: string;
  categoryId: string | null;
  brandId: string | null;
  variants: Variant[];
  images: Image[];
  category: string | null;
  brand: string | null;
  quantity: number;
  selectedVariantId?: string; // Track selected variant
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  product: Product;
  variant: Variant;
}

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001/api" }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products",
    }),

    getCart: builder.query<CartItem[], { userId: string }>({
      query: ({ userId }) => `/cart/${userId}`,
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation({
      query: ({ userId, productId, variantId, quantity }) => ({
        url: "/cart/add",
        method: "POST",
        body: { userId, productId, variantId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation({
      query: ({ userId, productId, variantId, quantity }) => ({
        url: "/cart/update",
        method: "PUT",
        body: { userId, productId, variantId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation({
      query: ({ userId, productId, variantId }) => ({
        url: "/cart/remove",
        method: "DELETE",
        body: { userId, productId, variantId },
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation({
      query: ({ userId }) => ({
        url: "/cart/clear",
        method: "DELETE",
        body: { userId },
      }),
      invalidatesTags: ["Cart"],
    }),

    createOrder: builder.mutation({
      query: ({ userId }) => ({
        url: "/orders",
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useCreateOrderMutation,
} = productApi;
