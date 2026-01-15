import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
    credentials: "include",
  }),
  tagTypes: ["User", "Address"],

  endpoints: (builder) => ({
    getProfile: builder.query<any, void>({
      query: () => "/api/auth/auth-me",
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation<any, any>({
      query: (profileData) => ({
        url: "/api/user/profile", // Assuming this exists or will be created
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["User"],
    }),

    getAddresses: builder.query<any, void>({
      query: () => "/api/address",
      providesTags: ["Address"],
    }),

    createAddress: builder.mutation<any, any>({
      query: (addressData) => ({
        url: "/api/address",
        method: "POST",
        body: addressData,
      }),
      invalidatesTags: ["Address"],
    }),

    updateAddress: builder.mutation<any, { id: string; addressData: any }>({
      query: ({ id, addressData }) => ({
        url: `/api/address/${id}`,
        method: "PUT",
        body: addressData,
      }),
      invalidatesTags: ["Address"],
    }),

    deleteAddress: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/address/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),

    updatePassword: builder.mutation<any, any>({
      query: (passwordData) => ({
        url: "/api/user/password",
        method: "PUT",
        body: passwordData,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useUpdatePasswordMutation,
} = userApi;
