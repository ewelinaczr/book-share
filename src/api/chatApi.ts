import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

// Custom baseQuery that injects JWT token into Authorization header
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

  const rawBaseQuery = fetchBaseQuery({ baseUrl: "/api/v1/chat" });
  return rawBaseQuery(modifiedArgs, api, extraOptions);
};

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getChatHistory: builder.query<any, string>({
      query: (userId) => ({
        url: `/history/${userId}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    // Fetch all chat partners (users the current user has chatted with)
    getChatPartners: builder.query<any, void>({
      query: (params) => ({
        url: "/partners",
        method: "GET",
        credentials: "include",
        params,
      }),
    }),
  }),
});

export const { useGetChatHistoryQuery, useGetChatPartnersQuery } = chatApi;
