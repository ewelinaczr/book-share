"use client";

import { useTranslations } from "next-intl";
import { useAddBookToMarket } from "./useAddBookOffer";
import { usePopup } from "@/providers/PopupProvider";
import { useSession } from "next-auth/react";

import AddBookForm from "./AddBookOfferForm";
import Popup from "@/components/popup/Popup";

export default function AddBookOffer() {
  const t = useTranslations();
  const { openPopupId } = usePopup();
  const { onSubmit, isLoading } = useAddBookToMarket();
  const { data: session } = useSession();
  const currentUserId = session?.user.id;

  if (openPopupId || !currentUserId) {
    return null;
  }

  return (
    <Popup title={t("market_addBookOfferTitle")} onboardingId="nextstep-step9">
      <AddBookForm onSubmit={onSubmit} isLoading={isLoading} />
    </Popup>
  );
}
