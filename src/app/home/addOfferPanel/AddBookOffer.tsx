"use client";
import cn from "classnames";
import { useTranslations } from "next-intl";
import { useAddBookToMarket } from "./useAddBookOffer";
import { usePopup } from "@/providers/PopupProvider";
import styles from "./AddBookOffer.module.css";

import AddBookForm from "./AddBookOfferForm";
import Popup from "@/components/popup/Popup";
import Notification from "@/components/notification/Notification";

export default function AddBookOffer() {
  const t = useTranslations();
  const { openPopupId } = usePopup();
  const { onSubmit, status, isLoading } = useAddBookToMarket();

  const messageClass =
    status?.status === "error" ? styles.error : styles.success;

  if (openPopupId) {
    return null;
  }

  return (
    <Popup title={t("market_addBookOfferTitle")} onboardingId="nextstep-step9">
      <AddBookForm onSubmit={onSubmit} isLoading={isLoading} />
      {status && (
        <div className={cn(styles.notification, messageClass)}>
          <Notification message={t(status.messageKey)} status={status.status} />
        </div>
      )}
    </Popup>
  );
}
