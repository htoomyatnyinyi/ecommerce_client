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
  tagTypes: ["User"],
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
      invalidatesTags: ["User"],
    }),

    signUp: builder.mutation<any, SignUpData>({
      query: (authData) => ({
        url: "/api/auth/signup",
        method: "POST",
        body: authData,
      }),
      invalidatesTags: ["User"],
    }),

    authMe: builder.query<any, void>({
      query: () => "/api/auth/auth-me",
      providesTags: ["User"],
    }),

    verifyEmailToken: builder.mutation<any, VerifyEmailToken>({
      query: (token) => ({
        url: "/api/auth/verify-email",
        method: "POST",
        body: token,
      }),
      invalidatesTags: ["User"],
    }),

    signOut: builder.mutation<void, void>({
      query: () => ({
        url: "/api/auth/signout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
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
