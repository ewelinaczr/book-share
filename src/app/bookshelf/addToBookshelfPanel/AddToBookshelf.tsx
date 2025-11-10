"use client";

import React from "react";
import cn from "classnames";
import { useForm } from "react-hook-form";
import { AddBookshelfBook } from "@/interfaces/BookshelfBook";
import { useTranslations } from "next-intl";
import { useAddBookToBookshelf } from "./useAddBookToBookshelf";
import Button, { ButtonType } from "@/components/buttons/Button";
import AddToBookshelfForm from "./AddToBookshelfForm";
import Popup from "@/components/popup/Popup";
import styles from "./AddToBookshelf.module.css";

export default function AddToBookshelf() {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddBookshelfBook>();

  const { onSubmit, status, isLoading } = useAddBookToBookshelf();

  const messageClass =
    status?.status === "error" ? styles.error : styles.success;

  return (
    <Popup title={t("bookshelf_addBookTitle")}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <AddToBookshelfForm register={register} errors={errors} t={t} />
        <Button
          type="submit"
          ariaLabel={t("buttons_addBookToMarket")}
          disabled={isSubmitting || isLoading}
          buttonType={ButtonType.PRIMARY}
        >
          {isSubmitting || isLoading
            ? t("buttons_addingBook")
            : t("buttons_addBookToMarket")}
        </Button>
      </form>

      {status && (
        <div className={cn(styles.message, messageClass)}>
          {t(status.messageKey)}
        </div>
      )}
    </Popup>
  );
}
