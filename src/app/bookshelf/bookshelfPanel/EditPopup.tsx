import React from "react";
import cn from "classnames";
import { useTranslations } from "next-intl";
import { useUpdateBookshelfBook } from "./useUpdateBookshelfBook";
import { usePopup } from "@/providers/PopupProvider";
import styles from "./EditPopup.module.css";

import Header from "@/components/headers/Header";
import AddToBookshelfForm from "../addToBookshelfPanel/AddToBookshelfForm";
import Notification from "@/components/notification/Notification";
import CloseButton from "@/components/closeButton/CloseButton";

function EditPopup({
  bookId,
  onClose,
}: {
  bookId: string;
  onClose: () => void;
}) {
  const t = useTranslations();
  const title = t("bookshelf_update");
  const { setOpenPopupType } = usePopup();

  const { onSubmit, status, isLoading } = useUpdateBookshelfBook(bookId);

  const messageClass =
    status?.status === "error" ? styles.error : styles.success;

  const handleClose = () => {
    setOpenPopupType(null);
    onClose();
  };

  return (
    <article
      className={cn(
        styles.container,
        bookId ? styles.containerVisible : styles.containerHidden
      )}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`popup-title-${title.replace(/\s+/g, "-")}`}
        className={styles.popup}
      >
        <div id={`popup-title-${title.replace(/\s+/g, "-")}`}>
          <CloseButton handleClose={handleClose} />
          <Header label={title} />
        </div>
        <AddToBookshelfForm
          mode="update"
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
        {status && (
          <div className={cn(styles.message, messageClass)}>
            <Notification
              message={t(status.messageKey)}
              status={status.status}
            />
          </div>
        )}
      </div>
    </article>
  );
}

export default EditPopup;
