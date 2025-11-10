"use client";
import cn from "classnames";
import { useTranslations } from "next-intl";
import { useAddBookOffer } from "./useAddBookOffer";
import AddBookForm from "./AddBookOfferForm";
import Popup from "@/components/popup/Popup";
import Notification from "@/components/notification/Notification";
import styles from "./AddBookOffer.module.css";

export default function AddBookOffer() {
  const t = useTranslations();
  const { onSubmit, status, isLoading } = useAddBookOffer();

  const messageClass =
    status?.status === "error" ? styles.error : styles.success;

  return (
    <Popup title={t("market_addBookOfferTitle")}>
      <AddBookForm onSubmit={onSubmit} isLoading={isLoading} />
      {status && (
        <div className={cn(styles.notification, messageClass)}>
          <Notification message={t(status.messageKey)} status={status.status} />
        </div>
      )}
    </Popup>
  );
}
