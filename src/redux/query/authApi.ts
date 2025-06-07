import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type SignInData = {
  email: string | undefined;
  password: string | undefined;
};

type VerifyEmailToken = {
  token: string;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
    credentials: "include",
  }), // Replace with your API
  endpoints: (builder) => ({
    // getProducts: builder.query<Produts[], void>({

    signIn: builder.mutation<any, SignInData>({
      query: (authData) => ({
        url: "/api/auth/signin",
        method: "POST",
        body: authData,
      }),
    }),

    verifyEmailToken: builder.mutation<any, VerifyEmailToken>({
      query: (token) => ({
        url: "/api/auth/verify-email",
        method: "POST",
        body: token,
      }),
    }),
  }),
});

export const { useSignInMutation, useVerifyEmailTokenMutation } = authApi;
