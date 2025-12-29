"use client";
import cn from "classnames";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { RequestMarketBook, MarketBookStatus } from "@/interfaces/MarketBook";
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
  mode = "add",
}: {
  onSubmit: (data: RequestMarketBook) => void;
  isLoading: boolean;
  mode?: "add" | "update";
}) {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RequestMarketBook>();
  const statusOptions = useStatusOptions();
  const status = watch("status");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={cn(styles.inputContainer, styles.select)}>
        <Select
          label={t("labels_status")}
          value={status || ""}
          options={statusOptions}
          onChange={(val) =>
            setValue("status", val as MarketBookStatus, {
              shouldValidate: true,
            })
          }
          error={errors.status?.message}
        />
      </div>
      <div className={styles.titleAuthor}>
        {mode === "add" ? (
          <Input
            id="isbn"
            className={styles.input}
            label={t("labels_isbn")}
            placeholder={t("placeholders_isbn")}
            {...register("isbn")}
            error={errors.isbn?.message}
          />
        ) : null}
        {mode === "add" ? (
          <Input
            id="title"
            className={styles.input}
            label={t("labels_title")}
            placeholder={t("placeholders_bookTitle")}
            {...register("title")}
            error={errors.title?.message}
          />
        ) : null}
        {mode === "add" ? (
          <Input
            id="author"
            className={styles.input}
            label={t("labels_author")}
            placeholder={t("placeholders_authorName")}
            {...register("author")}
            error={errors.author?.message}
          />
        ) : null}
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
