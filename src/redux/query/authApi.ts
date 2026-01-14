import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type SignInData = {
  email: string | undefined;
  password: string | undefined;
};

type VerifyEmailToken = {
  token: string;
};

type SignUpData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "ADMIN" | "USER" | "EMPLOYER";
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

    signUp: builder.mutation<any, SignUpData>({
      query: (authData) => ({
        url: "/api/auth/signup",
        method: "POST",
        body: authData,
      }),
    }),

    authMe: builder.query<any, void>({
      query: () => "/api/auth/me",
    }),

    verifyEmailToken: builder.mutation<any, VerifyEmailToken>({
      query: (token) => ({
        url: "/api/auth/verify-email",
        method: "POST",
        body: token,
      }),
    }),
    signOut: builder.mutation<void, void>({
      query: () => ({
        url: "/api/auth/signout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useAuthMeQuery,
  useVerifyEmailTokenMutation,
  useSignOutMutation,
} = authApi;
