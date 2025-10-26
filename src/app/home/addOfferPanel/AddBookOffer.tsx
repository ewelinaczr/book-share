"use client";
import { useTranslations } from "next-intl";
import { useAddBookOffer } from "./useAddBookOffer";
import AddBookForm from "./AddBookOfferForm";
import Popup from "@/components/popup/Popup";
import Notification from "@/components/notification/Notification";
import styles from "./AddBookOffer.module.css";

export default function AddBookOffer() {
  const t = useTranslations();
  const { onSubmit, status, isLoading } = useAddBookOffer();

  return (
    <Popup title={t("market_addBookOfferTitle")}>
      <AddBookForm onSubmit={onSubmit} isLoading={isLoading} />
      <div className={styles.notification}>
        {status?.message && (
          <Notification message={status.message} status={status.status} />
        )}
      </div>
    </Popup>
  );
}
