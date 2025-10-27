"use client";
import { useState, useEffect } from "react";
import { useAddBookToMarketMutation } from "@/api/marketApi";
import { fetchBookByIsbn } from "@/api/fetchBookByIsbn";
import { fetchBookByTitleAndAuthor } from "@/api/fetchBooksByTitleAuthor";
import { AddMarketBook } from "@/interfaces/MarketBook";
import { useTranslations } from "next-intl";

interface Status {
  status: "success" | "error";
  message: string;
}

export function useAddBookOffer() {
  const t = useTranslations();
  const [status, setStatus] = useState<Status | undefined>(undefined);
  const [addBookToMarket, { isLoading, isSuccess, isError }] =
    useAddBookToMarketMutation();

  useEffect(() => {
    if (isError) {
      setStatus({ status: "error", message: t("market_addBookError") });
    }
    if (isSuccess) {
      setStatus({ status: "success", message: t("market_addBookSuccess") });
    }
  }, [isError, isSuccess, t]);

  const onSubmit = async (data: AddMarketBook) => {
    setStatus(undefined);
    try {
      const bookData = data.isbn
        ? await fetchBookByIsbn(data.isbn)
        : await fetchBookByTitleAndAuthor(data.title, data.author);

      if (bookData) {
        await addBookToMarket({ status: data.status, book: bookData }).unwrap();
      } else {
        setStatus({ status: "error", message: t("market_bookNotFound") });
      }
    } catch (err: any) {
      setStatus({
        status: "error",
        message: err.message || t("market_addBookError"),
      });
    }
  };

  return { onSubmit, status, isLoading };
}
