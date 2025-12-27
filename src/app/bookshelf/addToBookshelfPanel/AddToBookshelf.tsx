"use client";
import React from "react";
import cn from "classnames";
import { useTranslations } from "next-intl";
import { useAddBookToBookshelf } from "./useAddBookToBookshelf";
import { usePopup } from "@/providers/PopupProvider";
import styles from "./AddToBookshelf.module.css";

import AddToBookshelfForm from "./AddToBookshelfForm";
import Popup from "@/components/popup/Popup";
import Notification from "@/components/notification/Notification";

export default function AddToBookshelf() {
  const t = useTranslations();
  const { openPopupId } = usePopup();
  const { onSubmit, status, isLoading } = useAddBookToBookshelf();

  const messageClass =
    status?.status === "error" ? styles.error : styles.success;

  if (openPopupId) {
    return null;
  }

  return (
    <Popup title={t("bookshelf_addBookTitle")} onboardingId="nextstep-step12">
      <AddToBookshelfForm onSubmit={onSubmit} isLoading={isLoading} />
      {status && (
        <div className={cn(styles.message, messageClass)}>
          <Notification message={t(status.messageKey)} status={status.status} />
        </div>
      )}
    </Popup>
  );
}
