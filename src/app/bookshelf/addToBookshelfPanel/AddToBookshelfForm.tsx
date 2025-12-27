import React from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { BookStatus } from "@/interfaces/BookshelfBook";
import { AddBookshelfBook } from "@/interfaces/BookshelfBook";
import styles from "./AddToBookshelf.module.css";

import Select from "@/components/inputs/Select";
import Input from "@/components/inputs/Input";
import Button, { ButtonType } from "@/components/buttons/Button";

const statusOptions = [
  { value: BookStatus.READING, label: "Currently reading" },
  { value: BookStatus.WANT_TO_READ, label: "Want to read" },
  { value: BookStatus.READ, label: "Read" },
];

const ownOptions = [
  { value: 1, label: "yes" },
  { value: 0, label: "no" },
];

const ratingOptions = [1, 2, 3, 4, 5].map((val) => ({
  value: val,
  label: val.toString(),
}));

export default function AddToBookshelfForm({
  onSubmit,
  isLoading,
  mode = "add",
}: {
  onSubmit: (data: AddBookshelfBook) => void;
  isLoading: boolean;
  mode?: "add" | "update";
}) {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddBookshelfBook>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div>
        <Select
          label={t("bookshelf_status")}
          options={statusOptions}
          {...register("status")}
          error={errors.status?.message}
        />
        <Select
          label={t("bookshelf_own")}
          options={ownOptions}
          {...register("own")}
          error={errors.own?.message}
        />
      </div>
      <div>
        <Select
          label={t("bookshelf_rating")}
          options={ratingOptions}
          {...register("rating")}
          error={errors.rating?.message}
        />
        {mode === "add" && (
          <Input
            id="isbn"
            label={t("placeholders_isbn")}
            type="text"
            placeholder={t("placeholders_enterIsbn")}
            {...register("isbn")}
            error={(errors as FieldErrors<AddBookshelfBook>).isbn?.message}
          />
        )}
      </div>
      <div className={styles.button}>
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
      </div>
    </form>
  );
}
