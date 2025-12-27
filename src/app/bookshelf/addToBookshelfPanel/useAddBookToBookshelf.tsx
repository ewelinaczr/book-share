"use client";
import { useMemo, useState } from "react";
import { useAddBookToBookshelfMutation } from "@/api/bookshelfApi";
import { fetchBookByIsbn } from "@/api/fetchBookByIsbn";
import { AddBookshelfBook } from "@/interfaces/BookshelfBook";

type Status =
  | { status: "success"; messageKey: string }
  | { status: "error"; messageKey: string }
  | undefined;

export function useAddBookToBookshelf() {
  const [addBookToBookshelf, { isLoading, isSuccess, isError }] =
    useAddBookToBookshelfMutation();

  const [errorKey, setErrorKey] = useState<string | undefined>(undefined);

  const status: Status = useMemo(() => {
    if (errorKey) return { status: "error", messageKey: errorKey };
    if (isError)
      return { status: "error", messageKey: "bookshelf_addBookError" };
    if (isSuccess)
      return { status: "success", messageKey: "bookshelf_addBookSuccess" };
    return undefined;
  }, [isError, isSuccess, errorKey]);

  const onSubmit = async (data: AddBookshelfBook) => {
    setErrorKey(undefined);
    try {
      const bookData = await fetchBookByIsbn(data.isbn);
      if (!bookData) {
        setErrorKey("bookshelf_bookNotFound");
        return;
      }

      await addBookToBookshelf({
        status: data.status,
        own: !!data.own,
        rating: data.rating,
        book: bookData,
      }).unwrap();
    } catch (err: any) {
      setErrorKey("bookshelf_addBookError");
    }
  };

  return { onSubmit, status, isLoading };
}
