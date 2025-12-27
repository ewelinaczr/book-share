"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { useAddBookToBookshelf } from "./useAddBookToBookshelf";
import { usePopup } from "@/providers/PopupProvider";
import { useSession } from "next-auth/react";

import AddToBookshelfForm from "./AddToBookshelfForm";
import Popup from "@/components/popup/Popup";

export default function AddToBookshelf() {
  const t = useTranslations();
  const { openPopupId } = usePopup();
  const { onSubmit, isLoading } = useAddBookToBookshelf();
  const { data: session } = useSession();
  const currentUserId = session?.user.id;

  if (openPopupId || !currentUserId) {
    return null;
  }

  return (
    <Popup title={t("bookshelf_addBookTitle")} onboardingId="nextstep-step12">
      <AddToBookshelfForm onSubmit={onSubmit} isLoading={isLoading} />
    </Popup>
  );
}
