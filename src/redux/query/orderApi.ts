import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
    credentials: "include",
  }),
  tagTypes: ["Order"],

  endpoints: (builder) => ({
    getOrders: builder.query<any, void>({
      query: () => "/api/order",
      transformResponse: (response: any) => response.orders,
      providesTags: ["Order"],
    }),

    getOrderById: builder.query<any, string>({
      query: (id) => `/api/order/${id}`,
      transformResponse: (response: any) => response.order,
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),

    updateOrderStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/api/order/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),

    getOrderStats: builder.query<any, void>({
      query: () => "/api/order/stats",
      providesTags: ["Order"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetOrderStatsQuery,
} = orderApi;
