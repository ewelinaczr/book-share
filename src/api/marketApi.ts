import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
import type { MarketBook, MarketBookStatus } from "../interfaces/MarketBook";

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

  const rawBaseQuery = fetchBaseQuery({ baseUrl: "/api/v1/market" });
  return rawBaseQuery(modifiedArgs, api, extraOptions);
};

export const marketApi = createApi({
  reducerPath: "marketApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Market"],
  endpoints: (builder) => ({
    // Get all books from the market (optionally filter by status)
    getAllMarketBooks: builder.query<
      MarketBook[],
      { status?: MarketBookStatus }
    >({
      query: (params) => ({
        url: "/",
        method: "GET",
        credentials: "include",
        params,
      }),
      providesTags: ["Market"],
    }),
    // Add a book to the market
    addBookToMarket: builder.mutation<MarketBook, Partial<MarketBook>>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Market"],
    }),
    // Get current user's market books (optionally filter by status)
    getUserMarketBooks: builder.query<
      MarketBook[],
      { status?: MarketBookStatus }
    >({
      query: (params) => ({
        url: "/mine",
        method: "GET",
        credentials: "include",
        params,
      }),
      providesTags: ["Market"],
    }),
    // Get all market books by a specific user
    getMarketBooksByUserId: builder.query<MarketBook[], string>({
      query: (userId) => ({
        url: `/${userId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Market"],
    }),
    // Exchange book on market
    exchangeMarketBook: builder.mutation<
      MarketBook,
      { bookId: string; status: MarketBookStatus; date?: Date }
    >({
      query: ({ bookId, status, date }) => ({
        url: `/exchange/${bookId}`,
        method: "PATCH",
        credentials: "include",
        body: { status, date },
      }),
      invalidatesTags: ["Market"],
    }),
    // Get market books borrowed by my
    getBorrowedBooks: builder.query<MarketBook[], void>({
      query: () => ({
        url: "/exchange/borrowed",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Market"],
    }),
    // Get market books borrowed from my
    getBorrowedFromMe: builder.query<MarketBook[], void>({
      query: () => ({
        url: "/exchange/borrowed-from-me",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Market"],
    }),
  }),
});

export const {
  useGetAllMarketBooksQuery,
  useAddBookToMarketMutation,
  useGetUserMarketBooksQuery,
  useGetMarketBooksByUserIdQuery,
  useExchangeMarketBookMutation,
  useGetBorrowedBooksQuery,
  useGetBorrowedFromMeQuery,
} = marketApi;
