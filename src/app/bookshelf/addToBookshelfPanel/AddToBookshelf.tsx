"use client";

import React, { useEffect, useState } from "react";
import styles from "./AddToBookshelf.module.css";
import { useForm } from "react-hook-form";
import { AddBookshelfBook, BookStatus } from "@/interfaces/BookshelfBook";
import { fetchBookByIsbn } from "@/api/fetchBookByIsbn";
import { pacifico } from "@/app/fonts";
import {
  useAddBookToBookshelfMutation,
  useGetBookshelfQuery,
} from "@/api/bookshelfApi";

import Input from "@/components/inputs/Input";
import Select from "@/components/inputs/Select";
import Button, { ButtonType } from "@/components/buttons/Button";

interface FetchStatus {
  success: boolean;
  message: string;
}

export default function AddToBookshelf() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddBookshelfBook>();
  const [formError, setFormError] = useState("");
  const [fetchStatus, setFetchStatus] = useState<FetchStatus | undefined>(
    undefined
  );
  const { data: readBook } = useGetBookshelfQuery({ status: BookStatus.READ });

  const [addBookToBookshelf, { isLoading, isSuccess, isError }] =
    useAddBookToBookshelfMutation();

  useEffect(() => {
    if (isError) {
      setFetchStatus({
        success: false,
        message: "Something went wrong",
      });
    }
    if (isSuccess) {
      setFetchStatus({
        success: true,
        message: "Successfully added to Your Bookshelf",
      });
    }
  }, [isError, isSuccess]);

  const onSubmit = async (data: AddBookshelfBook) => {
    setFormError("");
    try {
      const bookData = await fetchBookByIsbn(data.isbn);
      if (bookData) {
        const bookshelfBook = {
          status: data.status,
          own: !!data.own,
          rating: data.rating,
          book: bookData,
        };
        addBookToBookshelf(bookshelfBook);
      } else {
        setFormError("Book not found by provided ISBN");
      }
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  if (isError) {
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <p className={`${pacifico.className} ${styles.formTitle}`}>
          Add Book to the Bookshelf
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Select
            label="Status"
            options={[
              { value: BookStatus.READING, label: "Currently reading" },
              { value: BookStatus.WANT_TO_READ, label: "Want to read" },
              { value: BookStatus.READ, label: "Read" },
            ]}
            {...register("status")}
            error={errors.status?.message}
          />
          <Select
            label="Own"
            options={[
              { value: 1, label: "yes" },
              { value: 0, label: "no" },
            ]}
            {...register("own")}
            error={errors.own?.message}
          />
          <Select
            label="Rating"
            options={[
              { value: 1, label: "1" },
              { value: 2, label: "2" },
              { value: 3, label: "3" },
              { value: 4, label: "4" },
              { value: 5, label: "5" },
            ]}
            {...register("rating")}
            error={errors.rating?.message}
          />
          <Input
            id="isbn"
            label="ISBN"
            type="text"
            placeholder="Enter ISBN number"
            {...register("isbn")}
            error={errors.isbn?.message}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            buttonType={ButtonType.PRIMARY}
          >
            {isSubmitting || isLoading
              ? "Adding book..."
              : "Add book to Your Bookshelf"}
          </Button>
        </form>
        <div
          className={`${styles.message} ${
            !fetchStatus?.success || formError ? styles.error : styles.success
          }`}
        >
          {formError ? formError : ""}
          {fetchStatus ? fetchStatus.message : ""}
        </div>
      </div>
    </div>
  );
}
