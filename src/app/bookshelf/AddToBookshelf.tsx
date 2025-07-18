"use client";

import React, { useState } from "react";
import styles from "./AddToBookshelf.module.css";
import { useForm } from "react-hook-form";
import { AddBookshelfBook, BookStatus } from "@/interfaces/BookshelfBook";
import { fetchBookByIsbn } from "@/api/fetchBookByIsbn";
import { useAddBookToBookshelfMutation } from "@/api/bookshelfApi";

import Input from "@/components/inputs/Input";
import Select from "@/components/inputs/Select";

interface FetchStatus {
  success: boolean;
  message: string;
}

function getFetchStatus(
  isError: boolean,
  isSuccess: boolean
): FetchStatus | undefined {
  if (isError) {
    return { success: false, message: "Something went wrong" };
  }
  if (isSuccess) {
    return {
      success: true,
      message: "Book successfully added to Your Bookshelf",
    };
  }
  return undefined;
}

export default function AddToBookshelf() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddBookshelfBook>();
  const [formError, setFormError] = useState("");

  const [addBookToBookshelf, { isLoading, isSuccess, isError }] =
    useAddBookToBookshelfMutation();

  const fetchStatus = getFetchStatus(isError, isSuccess);

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

  return (
    <div>
      AddToBookshelf
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
          ]}
          {...register("rating")}
          error={errors.rating?.message}
        />
        <Input
          id="isbn"
          label="ISBN"
          type="text"
          {...register("isbn")}
          error={errors.isbn?.message}
        />
        <div>{formError ? formError : ""}</div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting || isLoading
            ? "Adding book..."
            : "Add book to Your Bookshelf"}
        </button>
      </form>
      <div>{fetchStatus ? fetchStatus.message : ""}</div>
    </div>
  );
}
