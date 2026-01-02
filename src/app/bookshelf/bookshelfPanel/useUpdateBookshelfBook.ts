"use client";
import { AddBookshelfBook } from "@/interfaces/BookshelfBook";
import { useEditBookshelfBookMutation } from "@/api/bookshelfApi";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

export function useUpdateBookshelfBook(bookId: string) {
  const [editBook, { isLoading }] = useEditBookshelfBookMutation();
  const t = useTranslations();

  const onSubmit = async (data: AddBookshelfBook) => {
    try {
      await editBook({
        _id: bookId,
        status: data.status,
        own: !!data.own,
        rating: data.rating,
      });
    } catch (err: any) {
      toast.error(t("bookshelf_addBookError"));
    }
  };

  return { onSubmit, isLoading };
}
