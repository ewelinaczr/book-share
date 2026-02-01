import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
import { revalidateMarket } from "@/app/actions/revalidate";
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

/** * This helper ensures we only clear the Next.js server cache
 * if the backend mutation actually succeeds.
 */
const handleMarketRevalidation = async (arg: any, { queryFulfilled }: any) => {
  try {
    await queryFulfilled; // Wait for the API success
    await revalidateMarket(); // Clear the Next.js Server Cache
  } catch (error) {
    console.error("Market revalidation skipped due to error:", error);
  }
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
      onQueryStarted: handleMarketRevalidation,
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
      onQueryStarted: handleMarketRevalidation,
    }),
    // Request an exchange (borrow/claim/trade)
    requestExchange: builder.mutation<
      MarketBook,
      { bookId: string; status: MarketBookStatus; date?: Date }
    >({
      query: ({ bookId, status, date }) => ({
        url: `/exchange/request/${bookId}`,
        method: "POST",
        credentials: "include",
        body: { status, date },
      }),
      invalidatesTags: ["Market"],
      onQueryStarted: handleMarketRevalidation,
    }),
    getRequestsMine: builder.query<MarketBook[], void>({
      query: () => ({
        url: "/exchange/requests/mine",
        method: "GET",
      }),
      providesTags: ["Market"],
    }),
    getRequestsToMe: builder.query<MarketBook[], void>({
      query: () => ({
        url: "/exchange/requests/to-me",
        method: "GET",
      }),
      providesTags: ["Market"],
    }),
    // Accept or decline an exchange request
    acceptExchange: builder.mutation<
      MarketBook,
      { bookId: string; requestId: string; decision: "accept" | "decline" }
    >({
      query: ({ bookId, requestId, decision }) => ({
        url: `/exchange/accept/${bookId}`,
        method: "POST",
        credentials: "include",
        body: { requestId, decision },
      }),
      invalidatesTags: ["Market"],
      onQueryStarted: handleMarketRevalidation,
    }),
    // Withdraw (delete) a pending exchange request I created
    withdrawRequest: builder.mutation<
      MarketBook,
      { bookId: string; requestId: string }
    >({
      query: ({ bookId, requestId }) => ({
        url: `/exchange/request/${bookId}/${requestId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Market"],
      onQueryStarted: handleMarketRevalidation,
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
    removeBookFromMarket: builder.mutation<MarketBook, Partial<MarketBook>>({
      query: ({ _id }) => ({
        url: `/${_id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Market"],
      onQueryStarted: handleMarketRevalidation,
    }),
    editMarketBook: builder.mutation<MarketBook, Partial<MarketBook>>({
      query: ({ _id, status }) => ({
        url: `/${_id}`,
        method: "PATCH",
        credentials: "include",
        body: { status },
      }),
      invalidatesTags: ["Market"],
      onQueryStarted: handleMarketRevalidation,
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
  useRemoveBookFromMarketMutation,
  useEditMarketBookMutation,
  useRequestExchangeMutation,
  useAcceptExchangeMutation,
  useGetRequestsMineQuery,
  useGetRequestsToMeQuery,
  useWithdrawRequestMutation,
} = marketApi;
