import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",

  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),

  endpoints: (builder) => ({
    createAccount: builder.mutation({
      query: (authData) => ({
        url: "/api/auth",
        method: "POST",
        body: authData,
      }),
    }),

    getAccount: builder.query({
      query: () => "/api/auth",
    }),

    getAccountById: builder.query({
      query: (id) => `/api/auth/${id}`,
    }),

    updateAccount: builder.mutation({
      query: (updateData) => ({
        url: "/api/auth",
        method: "PUT",
        body: updateData,
      }),
    }),

    deleteAccunt: builder.mutation({
      query: (accountId) => ({
        url: "/api/auth",
        method: "DELETE",
        body: accountId,
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
