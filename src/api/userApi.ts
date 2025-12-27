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
        // return text on errors (serializable) and an object with arrayBuffer+contentType on success
        responseHandler: async (response: Response) => {
          if (!response.ok) return response.text();
          const arrayBuffer = await response.arrayBuffer();
          return {
            data: arrayBuffer,
            contentType: response.headers.get("content-type") || "image/jpeg",
          } as { data: ArrayBuffer; contentType: string };
        },
      }),
      transformResponse: (result: any) => {
        // transformResponse only runs for successful results (the object with data/contentType)
        if (!result || typeof result !== "object" || !result.data) return "";
        const arrayBuffer: ArrayBuffer = result.data;
        const bytes = new Uint8Array(arrayBuffer);
        // Convert ArrayBuffer to base64 (work in small chunks to avoid call size limits)
        let binary = "";
        const chunkSize = 0x8000;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          const chunk = bytes.subarray(i, i + chunkSize);
          binary += String.fromCharCode.apply(null, Array.from(chunk) as any);
        }
        const base64 =
          typeof btoa === "function"
            ? btoa(binary)
            : Buffer.from(binary, "binary").toString("base64");
        return `data:${result.contentType};base64,${base64}`;
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
