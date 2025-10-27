import { User } from "@/interfaces/User";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["User"],
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/users",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query: () => ({ url: "/me", method: "GET" }),
      providesTags: ["User"],
    }),
    login: builder.mutation<User, { email: string; password: string }>({
      query: (body) => ({ url: "/login", method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    signup: builder.mutation<
      User,
      { name: string; email: string; password: string; passwordConfirm: string }
    >({
      query: (body) => ({ url: "/signup", method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation<any, void>({
      query: () => ({ url: "/logout", method: "POST" }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
} = userApi;
