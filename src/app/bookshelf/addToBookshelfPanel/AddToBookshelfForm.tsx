import React from "react";
import Select from "@/components/inputs/Select";
import Input from "@/components/inputs/Input";
import { BookStatus } from "@/interfaces/BookshelfBook";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { AddBookshelfBook } from "@/interfaces/BookshelfBook";

interface Props {
  register: UseFormRegister<AddBookshelfBook>;
  errors: FieldErrors<AddBookshelfBook>;
  t: (key: string) => string;
}

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

export default function AddToBookshelfForm({ register, errors, t }: Props) {
  return (
    <>
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
        <Input
          id="isbn"
          label={t("placeholders_isbn")}
          type="text"
          placeholder={t("placeholders_enterIsbn")}
          {...register("isbn")}
          error={errors.isbn?.message}
        />
      </div>
    </>
  );
}
