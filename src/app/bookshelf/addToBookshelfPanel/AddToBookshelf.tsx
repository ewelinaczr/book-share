"use client";

import React, { useEffect, useState } from "react";
import styles from "./AddToBookshelf.module.css";
import { useForm } from "react-hook-form";
import { AddBookshelfBook, BookStatus } from "@/interfaces/BookshelfBook";
import { fetchBookByIsbn } from "@/api/fetchBookByIsbn";
import {
  useAddBookToBookshelfMutation,
  useGetBookshelfQuery,
} from "@/api/bookshelfApi";
import { Pacifico } from "next/font/google";
import { FaMasksTheater } from "react-icons/fa6";
import { BsStars } from "react-icons/bs";
import { FaPenNib } from "react-icons/fa6";
import { GiOpenBook } from "react-icons/gi";
import { PiBooksFill } from "react-icons/pi";

import Input from "@/components/inputs/Input";
import Select from "@/components/inputs/Select";
import Button, { ButtonType } from "@/components/buttons/Button";

interface FetchStatus {
  success: boolean;
  message: string;
}

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
});

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

  const renderLongestBookRead = () => {
    if (!readBook || readBook.length === 0) return null;
    const longestBook = readBook.reduce((max, b) => {
      const maxPages = max?.book?.volumeInfo?.pageCount || 0;
      const currentPages = b?.book?.volumeInfo?.pageCount || 0;
      return currentPages > maxPages ? b : max;
    });

    const pageCount = longestBook?.book?.volumeInfo?.pageCount;

    return pageCount ? (
      <div className={styles.statsContainer}>
        <GiOpenBook className={styles.statsIconTrophy} />
        <p className={styles.stats}>
          Longest Book Read:
          <span
            className={`${pacifico.className} ${styles.statsCount}`}
          >{`${pageCount} pages, ${longestBook?.book?.volumeInfo.title} by ${longestBook?.book?.volumeInfo.authors?.[0]}`}</span>
        </p>
      </div>
    ) : null;
  };

  const renderFavoriteGenreRead = () => {
    if (!readBook || readBook.length === 0) return null;
    const categoryCount: { [key: string]: number } = {};

    readBook.forEach((b) => {
      const categories = b?.book.volumeInfo?.categories || [];

      categories.forEach((cat) => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
    });

    const favorite = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]);

    console.log(favorite);

    return favorite ? (
      <div className={styles.statsContainer}>
        <FaMasksTheater className={styles.statsIconTrophy} />
        <div className={styles.stats}>
          Most Popular Genres
          <span className={`${pacifico.className} ${styles.statsCount}`}>
            {favorite[0][0]}
            {favorite[1][0] ? `, ${favorite[1][0]}` : ""}
            {favorite[2][0] ? `, ${favorite[2][0]}` : ""}
          </span>
        </div>
      </div>
    ) : null;
  };

  const renderFavoriteAuthors = () => {
    if (!readBook || readBook.length === 0) return null;

    const authorStats: Record<string, { count: number; ratings: number[] }> =
      {};

    readBook.forEach((b) => {
      const authors = b?.book?.volumeInfo?.authors || [];
      const rating = +b?.rating;

      authors.forEach((author) => {
        if (!authorStats[author]) {
          authorStats[author] = { count: 0, ratings: [] };
        }
        authorStats[author].count += 1;
        if (!isNaN(rating)) {
          authorStats[author].ratings.push(rating);
        }
      });
    });

    const sortedAuthors = Object.entries(authorStats)
      .map(([author, { count, ratings }]) => {
        const avgRating = ratings.length
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;
        return { author, count, avgRating };
      })
      .sort((a, b) => {
        if (b.count === a.count) {
          return b.avgRating - a.avgRating;
        }
        return b.count - a.count;
      })
      .slice(0, 3);

    return sortedAuthors.length ? (
      <div className={styles.statsContainer}>
        <FaPenNib className={styles.statsIconTrophy} />
        <p className={styles.stats}>
          Top Authors
          <span className={`${pacifico.className} ${styles.statsCount}`}>
            {sortedAuthors.map((a) => a.author).join(", ")}
          </span>
        </p>
      </div>
    ) : null;
  };

  const renderHighestRatedReadCount = () => {
    if (!readBook || readBook.length === 0) return null;
    const fiveStarBooksCount = readBook.filter((b) => b?.rating === 5).length;
    return fiveStarBooksCount ? (
      <div className={styles.statsContainer}>
        <BsStars className={styles.statsIconTrophy} />
        <p className={styles.stats}>
          Books Rated 5 Stars
          <span className={`${pacifico.className} ${styles.statsCount}`}>
            {fiveStarBooksCount}
          </span>
        </p>
      </div>
    ) : null;
  };

  const renderReadBooksCount = () => {
    const count = readBook?.length || 0;

    return (
      <div className={styles.statsContainer}>
        <PiBooksFill className={styles.statsIconTrophy} />
        <p className={styles.stats}>
          Read Books
          <span className={`${pacifico.className} ${styles.statsCount}`}>
            {count}
          </span>
        </p>
      </div>
    );
  };

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
      <div>
        <p className={`${pacifico.className} ${styles.formTitle}`}>
          Bookshelf Insights
        </p>
        {renderReadBooksCount()}
        {renderLongestBookRead()}
        {renderFavoriteGenreRead()}
        {renderHighestRatedReadCount()}
        {renderFavoriteAuthors()}
      </div>
    </div>
  );
}
