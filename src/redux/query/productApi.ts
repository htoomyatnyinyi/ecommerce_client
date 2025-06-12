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
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
    credentials: "include",
  }),
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

    getCart: builder.query<CartItem[], void>({
      query: () => `/api/cart`,
      providesTags: ["Cart"],
    }),
    // getCart: builder.query<CartItem[], { userId: string }>({
    //   query: ({ userId }) => `/api/cart/${userId}`,
    //   providesTags: ["Cart"],
    // }),

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

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export type Produts = {
//   id: number;
//   title: string;
//   description: string;
//   price: number;
//   inStock: number;
//   category: string;
//   stockId: number;
//   userId: number;
//   createAt: Date;
//   updateAt: Date;
// };

// export const productApi = createApi({
//   reducerPath: "productApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "http://localhost:8080",
//     credentials: "include",
//   }),

//   endpoints: (builder) => ({
//     // getProducts: builder.query<Produts[], void>({
//     getProducts: builder.query<{ data: Produts[] }, void>({
//       query: () => "/api/products",
//     }),

//     getProductById: builder.query({
//       query: (id) => `/api/products/${id}`,
//     }),

//     createNewProduct: builder.mutation({
//       query: (productFormData) => ({
//         url: "/api/products",
//         method: "POST",
//         body: productFormData,
//       }),
//     }),
//   }),
// });

// export const {
//   useGetProductsQuery,
//   useGetProductByIdQuery,
//   useCreateNewProductMutation,
// } = productApi;
