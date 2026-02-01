"use client";
import { useAddBookToMarketMutation } from "@/api/marketApi";
import { fetchBookByIsbn } from "@/api/fetchBookByIsbn";
import { fetchBookByTitleAndAuthor } from "@/api/fetchBooksByTitleAuthor";
import { RequestMarketBook } from "@/interfaces/MarketBook";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
export function useAddBookToMarket() {
  const [addBookToMarket, { isLoading }] = useAddBookToMarketMutation();
  const t = useTranslations();

  const onSubmit = async (data: RequestMarketBook) => {
    try {
      const bookData = data.isbn
        ? await fetchBookByIsbn(data.isbn)
        : await fetchBookByTitleAndAuthor(data.title, data.author);

      if (!bookData) {
        toast.error(t("market_bookNotFound"));
        return;
      }

      await addBookToMarket({ status: data.status, book: bookData }).unwrap();
      toast.success(t("market_addBookSuccess"));
    } catch (err: any) {
      toast.error(t("market_addBookError"));
    }
  };

  return { onSubmit, isLoading };
}
