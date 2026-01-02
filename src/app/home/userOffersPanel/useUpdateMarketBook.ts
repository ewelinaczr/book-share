"use client";
import { useEditMarketBookMutation } from "@/api/marketApi";
import { RequestMarketBook } from "@/interfaces/MarketBook";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

export function useUpdateMarketBookOffer(bookId: string) {
  const [editBook, { isLoading }] = useEditMarketBookMutation();
  const t = useTranslations();

  const onSubmit = async (data: RequestMarketBook) => {
    try {
      await editBook({
        _id: bookId,
        status: data.status,
      });
      toast.success(t("market_updateBookSuccess"));
    } catch (err: any) {
      toast.error(t("market_addBookError"));
    }
  };

  return { onSubmit, isLoading };
}
