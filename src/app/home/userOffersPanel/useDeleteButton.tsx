import React, { useCallback } from "react";
import { IoTrashBinOutline } from "react-icons/io5";
import { useRemoveBookFromMarketMutation } from "@/api/marketApi";
import styles from "./Buttons.module.css";

export function useDeleteButton<U extends { _id?: string }>(
  getMessageText?: (book: U) => string
) {
  const [removeBook] = useRemoveBookFromMarketMutation();

  const handleDelete = useCallback((book: U) => {
    removeBook({ _id: book._id });
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
