"use client";

import { useTranslations } from "next-intl";
import { useAddBookToMarket } from "./useAddBookOffer";
import { usePopup } from "@/providers/PopupProvider";

import AddBookForm from "./AddBookOfferForm";
import Popup from "@/components/popup/Popup";

export default function AddBookOffer() {
  const t = useTranslations();
  const { openPopupId } = usePopup();
  const { onSubmit, isLoading } = useAddBookToMarket();

  if (openPopupId) {
    return null;
  }

  return (
    <Popup title={t("market_addBookOfferTitle")} onboardingId="nextstep-step9">
      <AddBookForm onSubmit={onSubmit} isLoading={isLoading} />
    </Popup>
  );
}
