"use client";
import { useMemo, useState } from "react";
import { useAddBookToMarketMutation } from "@/api/marketApi";
import { fetchBookByIsbn } from "@/api/fetchBookByIsbn";
import { fetchBookByTitleAndAuthor } from "@/api/fetchBooksByTitleAuthor";
import { AddMarketBook } from "@/interfaces/MarketBook";

type Status =
  | { status: "success"; messageKey: string }
  | { status: "error"; messageKey: string }
  | undefined;

export function useAddBookOffer() {
  const [addBookToMarket, { isLoading, isSuccess, isError }] =
    useAddBookToMarketMutation();

  const [errorKey, setErrorKey] = useState<string | undefined>(undefined);

  const status: Status = useMemo(() => {
    if (errorKey) return { status: "error", messageKey: errorKey };
    if (isError) return { status: "error", messageKey: "market_addBookError" };
    if (isSuccess)
      return { status: "success", messageKey: "market_addBookSuccess" };
    return undefined;
  }, [isError, isSuccess, errorKey]);

  const onSubmit = async (data: AddMarketBook) => {
    setErrorKey(undefined);
    try {
      const bookData = data.isbn
        ? await fetchBookByIsbn(data.isbn)
        : await fetchBookByTitleAndAuthor(data.title, data.author);

      if (!bookData) {
        setErrorKey("market_bookNotFound");
        return;
      }

      await addBookToMarket({ status: data.status, book: bookData }).unwrap();
    } catch (err: any) {
      setErrorKey(err.message || "market_addBookError");
    }
  };

  return { onSubmit, status, isLoading };
}
