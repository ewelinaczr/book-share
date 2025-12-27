"use client";
import { useMemo, useState } from "react";
import { AddBookshelfBook } from "@/interfaces/BookshelfBook";
import { useEditBookshelfBookMutation } from "@/api/bookshelfApi";

type Status =
  | { status: "success"; messageKey: string }
  | { status: "error"; messageKey: string }
  | undefined;

export function useUpdateBookshelfBook(bookId: string) {
  const [editBook, { isLoading, isSuccess, isError }] =
    useEditBookshelfBookMutation();

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
      await editBook({
        _id: bookId,
        status: data.status,
        own: !!data.own,
        rating: data.rating,
      });
    } catch (err: any) {
      setErrorKey("bookshelf_addBookError");
    }
  };

  return { onSubmit, status, isLoading };
}
