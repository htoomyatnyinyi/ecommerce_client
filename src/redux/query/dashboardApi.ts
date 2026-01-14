import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
    credentials: "include",
  }),

  endpoints: (builder) => ({
    createAccount: builder.mutation({
      query: (authData) => ({
        url: "/admin/account",
        method: "POST",
        body: authData,
      }),
    }),

    getAccount: builder.query({
      query: () => "/admin/accounts",
    }),

    getAccountById: builder.query({
      query: (id) => `/admin/account/${id}`,
    }),

    updateAccount: builder.mutation({
      query: (updateData) => ({
        url: `/admin/account/${updateData.id}`,
        method: "PUT",
        body: updateData,
      }),
    }),

    deleteAccunt: builder.mutation({
      query: (accountId) => ({
        url: `/admin/account/${accountId}`,
        method: "DELETE",
        body: { id: accountId },
      }),
    }),

    getAdminStats: builder.query({
      query: () => "/admin/stats",
    }),

    getEmployerStats: builder.query({
      query: () => "/admin/employer/stats",
    }),

    getDetailedAnalytics: builder.query({
      query: () => "/admin/analytics",
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/admin/product/${productId}`,
        method: "DELETE",
      }),
    }),

    updateProduct: builder.mutation({
      query: (updateData) => ({
        url: `/admin/product/${updateData.id}`,
        method: "PUT",
        body: updateData,
      }),
    }),
  }),
});

export const {
  useCreateAccountMutation,
  useGetAccountQuery,
  useGetAccountByIdQuery,
  useUpdateAccountMutation,
  useDeleteAccuntMutation,
  useGetAdminStatsQuery,
  useGetEmployerStatsQuery,
  useGetDetailedAnalyticsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = dashboardApi;
