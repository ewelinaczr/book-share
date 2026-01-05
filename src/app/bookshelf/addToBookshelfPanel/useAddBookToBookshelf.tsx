"use client";
import { useAddBookToBookshelfMutation } from "@/api/bookshelfApi";
import { fetchBookByIsbn } from "@/api/fetchBookByIsbn";
import { AddBookshelfBook } from "@/interfaces/BookshelfBook";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

export function useAddBookToBookshelf() {
  const [addBookToBookshelf, { isLoading }] = useAddBookToBookshelfMutation();
  const t = useTranslations();

  const onSubmit = async (data: AddBookshelfBook) => {
    try {
      const bookData = await fetchBookByIsbn(data.isbn);
      if (!bookData) {
        toast.error(t("bookshelf_bookNotFound"));
        return;
      }

      await addBookToBookshelf({
        status: data.status,
        own: !!data.own,
        rating: data.rating,
        book: bookData,
      }).unwrap();
      toast.success(t("bookshelf_addBookSuccess"));
    } catch (err: any) {
      toast.error(t("bookshelf_addBookError"));
    }
  };

  return { onSubmit, isLoading };
}
