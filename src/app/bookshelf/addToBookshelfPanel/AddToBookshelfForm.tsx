"use client";

import React from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { BookStatus, AddBookshelfBook } from "@/interfaces/BookshelfBook";
import styles from "./AddToBookshelf.module.css";

import Select from "@/components/inputs/Select";
import Input from "@/components/inputs/Input";
import Button, { ButtonType } from "@/components/buttons/Button";

const statusOptions = [
  { value: BookStatus.READING.toString(), label: "Currently reading" },
  { value: BookStatus.WANT_TO_READ.toString(), label: "Want to read" },
  { value: BookStatus.READ.toString(), label: "Read" },
];

const ownOptions = [
  { value: "true", label: "yes" },
  { value: "false", label: "no" },
];

const ratingOptions = [1, 2, 3, 4, 5].map((val) => ({
  value: val.toString(),
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
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddBookshelfBook>();

  const status = watch("status");
  const own = watch("own");
  const rating = watch("rating");

  const handleLocalSubmit = async (data: AddBookshelfBook) => {
    try {
      onSubmit(data);
      reset();
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLocalSubmit)} className={styles.form}>
      <div>
        <Select
          label={t("bookshelf_status")}
          value={status ?? ""}
          options={statusOptions}
          onChange={(val) =>
            setValue("status", val as BookStatus, {
              shouldValidate: true,
            })
          }
          error={errors.status?.message}
        />
        <Select
          label={t("bookshelf_own")}
          value={own === undefined ? "" : String(own)}
          options={ownOptions}
          onChange={(val) =>
            setValue("own", val === "true", { shouldValidate: true })
          }
          error={errors.own?.message}
        />
      </div>
      <div>
        <Select
          label={t("bookshelf_rating")}
          value={rating === undefined ? "" : String(rating)}
          options={ratingOptions}
          onChange={(val) =>
            setValue("rating", Number(val), { shouldValidate: true })
          }
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
