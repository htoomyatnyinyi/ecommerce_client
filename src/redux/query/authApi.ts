import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type SignInData = {
  email: string | undefined;
  password: string | undefined;
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
  }),
});

export const { useSignInMutation } = authApi;
