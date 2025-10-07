"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AddMarketBook, MarketBookStatus } from "@/interfaces/MarketBook";
import { fetchBookByIsbn } from "@/api/fetchBookByIsbn";
import { useAddBookToMarketMutation } from "@/api/marketApi";
import { fetchBookByTitleAndAuthor } from "@/api/fetchBooksByTitleAuthor";
import styles from "./AddBookOffer.module.css";

import Select from "@/components/inputs/Select";
import Input from "@/components/inputs/Input";
import Button, { ButtonType } from "@/components/buttons/Button";
import Notification from "@/components/notification/Notification";
import Popup from "@/components/popup/Popup";

interface Status {
  status: "success" | "error";
  message: string;
}

export default function AddBookOffer() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddMarketBook>();
  const [status, setStatus] = useState<Status | undefined>(undefined);
  const [addBookToMarket, { isLoading, isSuccess, isError }] =
    useAddBookToMarketMutation();

  useEffect(() => {
    if (isError) {
      setStatus({
        status: "error",
        message: "Something went wrong, cnannot add book to Market",
      });
    }
    if (isSuccess) {
      setStatus({
        status: "success",
        message: "Book successfully added to the Market",
      });
    }
  }, [isError, isSuccess]);

  const onSubmit = async (data: AddMarketBook) => {
    setStatus(undefined);
    try {
      const bookData = data.isbn
        ? await fetchBookByIsbn(data.isbn)
        : await fetchBookByTitleAndAuthor(data.title, data.author);
      if (bookData) {
        const marketBook = {
          status: data.status,
          book: bookData,
        };
        addBookToMarket(marketBook);
      } else {
        setStatus({
          message: "Book not found by provided ISBN or title",
          status: "error",
        });
      }
    } catch (err: any) {
      setStatus(err.message);
    }
  };

  return (
    <Popup title="Add Book Offer to the Market">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={`${styles.inputContainer} ${styles.select}`}>
          <Select
            label="Offer type"
            options={[
              {
                value: MarketBookStatus.BORROW,
                label: "Borrow book",
              },
              { value: MarketBookStatus.CLAIM, label: "Give book back" },
              { value: MarketBookStatus.TRADE, label: "Trade" },
            ]}
            {...register("status")}
            error={errors.status?.message}
          />
        </div>
        <div className={styles.tittleAuthor}>
          <div className={styles.inputContainer}>
            <Input
              id="isbn"
              className={styles.input}
              label="Find book by ISBN"
              type="text"
              placeholder="ISBN 10 or 13"
              {...register("isbn")}
              error={errors.isbn?.message}
            />
          </div>
          <div className={styles.inputContainer}>
            <Input
              id="title"
              className={styles.input}
              label="Find book by Title and Author name"
              placeholder="Book title"
              type="text"
              {...register("title")}
              error={errors.isbn?.message}
            />
          </div>
          <div className={`${styles.inputContainer} ${styles.author}`}>
            <Input
              id="author"
              className={styles.input}
              placeholder="Author name"
              type="text"
              {...register("author")}
              error={errors.isbn?.message}
            />
          </div>
        </div>
        <div className={styles.button}>
          <Button
            type="submit"
            ariaLabel="Add book to Market"
            disabled={isSubmitting}
            buttonType={ButtonType.PRIMARY}
            customStyles={{ marginBottom: "1rem" }}
          >
            {isSubmitting || isLoading
              ? "Adding book..."
              : "Add book to Market"}
          </Button>
        </div>
      </form>
      <div className={styles.notification}>
        {status?.message ? (
          <Notification message={status?.message} status={status?.status} />
        ) : null}
      </div>
    </Popup>
  );
}
