"use client";
import { useState, useEffect } from "react";
import { useAddBookToBookshelfMutation } from "@/api/bookshelfApi";
import { fetchBookByIsbn } from "@/api/fetchBookByIsbn";
import { AddBookshelfBook } from "@/interfaces/BookshelfBook";
import { useTranslations } from "next-intl";

interface Status {
  status: "success" | "error";
  message: string;
}

export function useAddBookToBookshelf() {
  const t = useTranslations();
  const [status, setStatus] = useState<Status | undefined>(undefined);
  const [addBookToBookshelf, { isLoading, isSuccess, isError }] =
    useAddBookToBookshelfMutation();

  useEffect(() => {
    if (isError) {
      setStatus({ status: "error", message: t("bookshelf_addBookError") });
    }
    if (isSuccess) {
      setStatus({ status: "success", message: t("bookshelf_addBookSuccess") });
    }
  }, [isError, isSuccess, t]);

  const onSubmit = async (data: AddBookshelfBook) => {
    setStatus(undefined);
    try {
      const bookData = await fetchBookByIsbn(data.isbn);
      if (!bookData) {
        setStatus({ status: "error", message: t("bookshelf_bookNotFound") });
        return;
      }

      await addBookToBookshelf({
        status: data.status,
        own: !!data.own,
        rating: data.rating,
        book: bookData,
      }).unwrap();
    } catch (err: any) {
      setStatus({
        status: "error",
        message: err.message || t("bookshelf_addBookError"),
      });
    }
  };

  return { onSubmit, status, isLoading };
}
