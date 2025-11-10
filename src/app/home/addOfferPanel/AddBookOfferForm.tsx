"use client";
import { useForm } from "react-hook-form";
import { AddMarketBook, MarketBookStatus } from "@/interfaces/MarketBook";
import { useTranslations } from "next-intl";
import styles from "./AddBookOffer.module.css";

import Select from "@/components/inputs/Select";
import Input from "@/components/inputs/Input";
import Button, { ButtonType } from "@/components/buttons/Button";

export function useStatusOptions() {
  const t = useTranslations();
  return [
    { value: MarketBookStatus.BORROW, label: t("market_borrow") },
    { value: MarketBookStatus.CLAIM, label: t("market_claim") },
    { value: MarketBookStatus.TRADE, label: t("market_trade") },
  ];
}

export default function AddBookForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: AddMarketBook) => void;
  isLoading: boolean;
}) {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddMarketBook>();
  const statusOptions = useStatusOptions();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={`${styles.inputContainer} ${styles.select}`}>
        <Select
          label={t("labels_status")}
          options={statusOptions}
          {...register("status")}
          error={errors.status?.message}
        />
      </div>
      <div className={styles.titleAuthor}>
        <Input
          id="isbn"
          className={styles.input}
          label={t("labels_isbn")}
          placeholder={t("placeholders_isbn")}
          {...register("isbn")}
          error={errors.isbn?.message}
        />
        <Input
          id="title"
          className={styles.input}
          label={t("labels_title")}
          placeholder={t("placeholders_bookTitle")}
          {...register("title")}
          error={errors.title?.message}
        />
        <Input
          id="author"
          className={styles.input}
          label={t("labels_author")}
          placeholder={t("placeholders_authorName")}
          {...register("author")}
          error={errors.author?.message}
        />
      </div>
      <div className={styles.button}>
        <Button
          type="submit"
          ariaLabel={t("buttons_addBookToMarket")}
          disabled={isSubmitting}
          buttonType={ButtonType.PRIMARY}
          customStyles={{ marginBottom: "1rem" }}
        >
          {isSubmitting || isLoading
            ? t("buttons_addingBook")
            : t("buttons_addBookToMarket")}
        </Button>
      </div>
    </form>
  );
}
