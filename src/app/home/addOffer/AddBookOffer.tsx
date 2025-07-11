"use client";
import React, { useEffect, useState } from "react";
import styles from "./AddBookOffer.module.css";
import { useForm } from "react-hook-form";
import { AddMarketBook, MarketBookStatus } from "@/interfaces/MarketBook";
import { fetchBookByIsbn } from "@/api/fetchBookByIsbn";

import Input from "@/components/inputs/Input";
import Select from "@/components/inputs/Select";
import { useAddBookToMarketMutation } from "@/api/marketApi";
import Button, { ButtonType } from "@/components/button/Button";
import Header from "@/components/header/Header";

interface FetchStatus {
  success: boolean;
  message: string;
}

export default function AddBookOffer() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddMarketBook>();
  const [formError, setFormError] = useState("");
  const [fetchStatus, setFetchStatus] = useState<FetchStatus | undefined>(
    undefined
  );

  const [addBookToMarket, { isLoading, isSuccess, isError }] =
    useAddBookToMarketMutation();

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
        message: "Book successfully added to Your Bookshelf",
      });
    }
  }, [isError, isSuccess]);

  const onSubmit = async (data: AddMarketBook) => {
    setFormError("");
    try {
      const bookData = await fetchBookByIsbn(data.isbn);
      if (bookData) {
        const marketBook = {
          status: Object.values(MarketBookStatus)[
            Number(data.status)
          ] as MarketBookStatus,
          book: bookData,
        };
        console.log("market book", marketBook);
        addBookToMarket(marketBook);
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
    <>
      <div className={styles.container}>
        <Header label={"Add Book Offer to the Markat"} />
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.inputs}>
            <div className={styles.inputContainer}>
              <Select
                label="Offer type"
                options={[
                  { value: MarketBookStatus.BORROW, label: "Borrow book" },
                  { value: MarketBookStatus.CLAIM, label: "Give book back" },
                  { value: MarketBookStatus.TRADE, label: "Trade" },
                ]}
                {...register("status")}
                error={errors.status?.message}
              />
              <Input
                id="deadline"
                className={styles.input}
                label="Borrow deadline"
                type="date"
                {...register("deadline")}
                error={errors.deadline?.message}
              />
            </div>
            <div className={styles.inputContainer}>
              <Input
                id="isbn"
                className={styles.input}
                label="Find book by ISBN"
                type="text"
                {...register("isbn")}
                error={errors.isbn?.message}
              />
            </div>
            <div>{formError ? formError : ""}</div>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            buttonType={ButtonType.PRIMARY}
            className={styles.button}
          >
            {isSubmitting || isLoading
              ? "Adding book..."
              : "Add book to Market"}
          </Button>
        </form>
        <div>{fetchStatus ? fetchStatus.message : ""}</div>
      </div>
    </>
  );
}
