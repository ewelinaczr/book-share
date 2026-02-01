import React, { useCallback } from "react";
import { IoTrashBinOutline } from "react-icons/io5";
import { useRemoveBookFromMarketMutation } from "@/api/marketApi";
import { toast } from "react-toastify";
import styles from "./Buttons.module.css";
import { useTranslations } from "use-intl";

export function useDeleteButton<U extends { _id?: string }>(
  getMessageText?: (book: U) => string
) {
  const [removeBook] = useRemoveBookFromMarketMutation();
  const t = useTranslations();

  const handleDelete = useCallback(async (book: U) => {
    try {
      await removeBook({ _id: book._id }).unwrap();
      toast.success(t("market_bookRemoved"));
    } catch (err: any) {
      toast.error(t("market_failedToRemoveBook"));
    }
  }, []);

  const renderDeleteButton = (book: U) => {
    return (
      <div className={styles.buttonMessage}>
        {getMessageText ? (
          <p className={styles.deleteMessage}>{getMessageText(book)}</p>
        ) : null}
        <div
          className={styles.button}
          onClick={() => handleDelete?.(book)}
          aria-label="delete item"
        >
          <IoTrashBinOutline />
        </div>
      </div>
    );
  };

  return { renderDeleteButton };
}
