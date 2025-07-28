import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
    credentials: "include",
  }),
  tagTypes: ["Cart", "Category"],

  endpoints: (builder) => ({
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
  useGetProductByIdQuery,
  useCreateProductMutation,
  useAddToCartMutation,
  useGetCartQuery,
  //
  useCreateNewCategoryMutation,
  useCreateNewProductMutation,
  useGetCategoryQuery,
} = productApi;

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const productApi = createApi({
//   reducerPath: "productApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "http://localhost:8080",
//     credentials: "include",
//   }),

//   tagTypes: ["Cart", "Category"],

//   endpoints: (builder) => ({
//     getProducts: builder.query<any, void>({
//       query: () => "/api/products",
//     }),

//     getProductById: builder.query<any, any>({
//       query: (id) => `/api/products/${id}`,
//     }),

//     createNewProduct: builder.mutation({
//       query: (productFormData) => ({
//         url: "/api/products",
//         method: "POST",
//         body: productFormData,
//       }),
//     }),

//     createNewCategory: builder.mutation({
//       query: (categoryName) => ({
//         url: "/api/category",
//         method: "POST",
//         body: categoryName,
//       }),
//       invalidatesTags: ["Category"],
//     }),

//     getCategory: builder.query<any, void>({
//       query: () => "/api/category",
//       providesTags: ["Category"],
//     }),

//     getCart: builder.query<any, void>({
//       query: () => `/api/cart`,
//       providesTags: ["Cart"],
//     }),

//     addToCart: builder.mutation({
//       query: ({ productId, variantId, quantity }) => ({
//         url: "/api/cart/add",
//         method: "POST",
//         body: { productId, variantId, quantity },
//       }),
//       invalidatesTags: ["Cart"],
//     }),

//     updateCartItem: builder.mutation({
//       query: ({ productId, variantId, quantity }) => ({
//         url: "/api/cart/update",
//         method: "PUT",
//         body: { productId, variantId, quantity },
//       }),
//       invalidatesTags: ["Cart"],
//     }),

//     removeFromCart: builder.mutation({
//       query: ({ productId, variantId }) => ({
//         url: "/api/cart/remove",
//         method: "DELETE",
//         body: { productId, variantId },
//       }),
//       invalidatesTags: ["Cart"],
//     }),

//     clearCart: builder.mutation({
//       query: () => ({
//         url: "/api/cart/clear",
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Cart"],
//     }),

//     createOrder: builder.mutation({
//       query: ({ userId }) => ({
//         url: "/api/orders",
//         method: "POST",
//         body: { userId },
//       }),
//       invalidatesTags: ["Cart"],
//     }),
//   }),
// });

// export const {
//   useGetProductsQuery,
//   useGetProductByIdQuery,
//   useCreateNewProductMutation,
//   useCreateNewCategoryMutation,
//   useGetCategoryQuery,
//   useGetCartQuery,
//   useAddToCartMutation,
//   useUpdateCartItemMutation,
//   useRemoveFromCartMutation,
//   useClearCartMutation,
//   useCreateOrderMutation,
// } = productApi;
