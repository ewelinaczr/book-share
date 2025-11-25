"use client";
import { useMemo, useState } from "react";
import { useEditMarketBookMutation } from "@/api/marketApi";
import { AddMarketBook } from "@/interfaces/MarketBook";

type Status =
  | { status: "success"; messageKey: string }
  | { status: "error"; messageKey: string }
  | undefined;

export function useUpdateMarketBookOffer(bookId: string) {
  const [editBook, { isLoading, isSuccess, isError }] =
    useEditMarketBookMutation();

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
      await editBook({
        _id: bookId,
        status: data.status,
      });
    } catch (err: any) {
      setErrorKey(err.message || "market_addBookError");
    }
  };

  return { onSubmit, status, isLoading };
}
