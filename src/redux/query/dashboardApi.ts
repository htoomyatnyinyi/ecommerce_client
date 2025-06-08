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
  }),
});

export const {
  useCreateAccountMutation,
  useGetAccountQuery,
  useGetAccountByIdQuery,
  useUpdateAccountMutation,
  useDeleteAccuntMutation,
} = dashboardApi;
