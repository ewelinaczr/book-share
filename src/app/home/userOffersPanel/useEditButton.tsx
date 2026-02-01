import React, { useCallback } from "react";
import { CiEdit } from "react-icons/ci";
import { PopupType, usePopup } from "@/providers/PopupProvider";
import styles from "./Buttons.module.css";

export function useEditButton<U extends { _id?: string }>(
  setItemToEdit: (itemId: string) => void
) {
  const { setOpenPopupType } = usePopup();

  const handleEdit = useCallback(
    (item: U) => {
      if (!item._id) {
        return;
      }
      setItemToEdit(item._id);
      setOpenPopupType(PopupType.MARKET_UPDATE);
    },
    [setItemToEdit, setOpenPopupType]
  );

  const renderEditButton = (item: U) => {
    return (
      <div
        className={styles.button}
        onClick={() => handleEdit(item)}
        aria-label="edit item"
      >
        <CiEdit />
      </div>
    );
  };

  return { renderEditButton };
}
