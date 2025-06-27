"use client";
import React, { useEffect, useState } from "react";
import styles from "./AddBookOffer.module.css";
import { useForm } from "react-hook-form";
import { AddMarketBook, MarketBookStatus } from "@/interfaces/MarketBook";
import { fetchBookByIsbn } from "@/api/fetchBookByIsbn";

import Input from "@/components/inputs/Input";
import Select from "@/components/inputs/Select";
import { useAddBookToMarketMutation } from "@/api/marketApi";

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
      <div>
        Add Book Offer
        <form onSubmit={handleSubmit(onSubmit)}>
          <Select
            label="Status"
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
            label="deadline"
            type="date"
            {...register("deadline")}
            error={errors.deadline?.message}
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
              : "Add book to Market"}
          </button>
        </form>
        <div>{fetchStatus ? fetchStatus.message : ""}</div>
      </div>
    </>
  );
}
