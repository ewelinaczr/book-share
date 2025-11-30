import { User } from "@/interfaces/User";
import { getSession } from "next-auth/react";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQueryWithAuth = async (args: any, api: any, extraOptions: any) => {
  const session = await getSession();
  const token = session?.token;

  const modifiedArgs = {
    ...args,
    headers: {
      ...(args.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  const rawBaseQuery = fetchBaseQuery({ baseUrl: "/api/v1/users" });
  return rawBaseQuery(modifiedArgs, api, extraOptions);
};

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["User", "UserPhoto"],
  baseQuery: baseQueryWithAuth,
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
    uploadProfilePhoto: builder.mutation<
      { message: string; photoUrl: string },
      { userId: string; file: File }
    >({
      query: ({ userId, file }) => {
        const formData = new FormData();
        formData.append("photo", file);

        return {
          url: `/${userId}/photo`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["UserPhoto"],
    }),

    getUserPhoto: builder.query<string, string>({
      query: (id) => ({
        url: `/${id}/photo`,
        method: "GET",
        responseHandler: (response: Response) => response.blob(),
      }),
      transformResponse: async (blob: Blob) => {
        const arrayBuffer = await blob.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        return `data:${blob.type};base64,${base64}`;
      },
      providesTags: ["UserPhoto"],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
  useUploadProfilePhotoMutation,
  useGetUserPhotoQuery,
} = userApi;
