import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
import type { IBookshelfBook, BookStatus } from "@interfaces/BookshelfBook";

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

export const bookshelfApi = createApi({
  reducerPath: "bookshelfApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Bookshelf"],
  endpoints: (builder) => ({
    getBookshelf: builder.query<IBookshelfBook[], { status?: BookStatus }>({
      query: (params) => ({
        url: "/",
        method: "GET",
        params,
      }),
      providesTags: ["Bookshelf"],
    }),
    addBookToBookshelf: builder.mutation<
      IBookshelfBook,
      Partial<IBookshelfBook>
    >({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Bookshelf"],
    }),
  }),
});

export const { useGetBookshelfQuery, useAddBookToBookshelfMutation } =
  bookshelfApi;
