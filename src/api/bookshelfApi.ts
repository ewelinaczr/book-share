import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BookshelfBook, BookStatus } from "../interfaces/BookshelfBook";

export const bookshelfApi = createApi({
  reducerPath: "bookshelfApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1/bookshelf" }),
  endpoints: (builder) => ({
    getBookshelf: builder.query<BookshelfBook[], { status?: BookStatus }>({
      query: (params) => ({
        url: "/",
        method: "GET",
        credentials: "include",
        params,
      }),
    }),
    addBookToBookshelf: builder.mutation<BookshelfBook, Partial<BookshelfBook>>(
      {
        query: (body) => ({
          url: "/",
          method: "POST",
          body,
          credentials: "include",
        }),
      }
    ),
  }),
});

export const { useGetBookshelfQuery, useAddBookToBookshelfMutation } =
  bookshelfApi;
