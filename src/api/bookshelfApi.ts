import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
import { revalidateBookshelf } from "@/app/actions/revalidate";
import type { BookshelfBook, BookStatus } from "../interfaces/BookshelfBook";

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

  const rawBaseQuery = fetchBaseQuery({ baseUrl: "/api/v1/bookshelf" });
  return rawBaseQuery(modifiedArgs, api, extraOptions);
};

/** * This helper ensures we only clear the Next.js server cache
 * if the backend mutation actually succeeds.
 */
const handleBookshelfRevalidation = async (
  arg: any,
  { queryFulfilled }: any
) => {
  try {
    await queryFulfilled; // Wait for the API success
    await revalidateBookshelf(); // Clear the Next.js Server Cache
  } catch (error) {
    console.error("Bookshelf revalidation skipped due to error:", error);
  }
};

export const bookshelfApi = createApi({
  reducerPath: "bookshelfApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Bookshelf"],
  endpoints: (builder) => ({
    getBookshelf: builder.query<BookshelfBook[], { status?: BookStatus }>({
      query: (params) => ({
        url: "/",
        method: "GET",
        params,
      }),
      providesTags: ["Bookshelf"],
    }),
    addBookToBookshelf: builder.mutation<BookshelfBook, Partial<BookshelfBook>>(
      {
        query: (body) => ({
          url: "/",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Bookshelf"],
        onQueryStarted: handleBookshelfRevalidation,
      }
    ),
    removeBookFromBookshelf: builder.mutation<BookshelfBook, { _id: string }>({
      query: ({ _id }) => ({
        url: `/${_id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Bookshelf"],
      onQueryStarted: handleBookshelfRevalidation,
    }),
    editBookshelfBook: builder.mutation<BookshelfBook, Partial<BookshelfBook>>({
      query: ({ _id, status, rating, own }) => ({
        url: `/${_id}`,
        method: "PATCH",
        credentials: "include",
        body: { status, rating, own },
      }),
      invalidatesTags: ["Bookshelf"],
      onQueryStarted: handleBookshelfRevalidation,
    }),
  }),
});

export const {
  useGetBookshelfQuery,
  useAddBookToBookshelfMutation,
  useRemoveBookFromBookshelfMutation,
  useEditBookshelfBookMutation,
} = bookshelfApi;
