"use client";

import { BookshelfBook, BookStatus } from "@/interfaces/BookshelfBook";
import { useGetBookshelfQuery } from "@/api/bookshelfApi";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { useTranslations } from "next-intl";
import BookListPanel from "@/components/bookListPanel/BookListPanel";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import styles from "./Bookshelf.module.css";

const getBookData = (item: BookshelfBook) => {
  const { volumeInfo } = item.book;
  return {
    ...volumeInfo,
    id: item.book._id ?? "",
    imageSrc:
      volumeInfo.imageLinks?.smallThumbnail ??
      volumeInfo.imageLinks?.thumbnail ??
      null,
  };
};

const renderRatingFooter = (
  selectedItem: BookshelfBook,
  t: (key: string) => string
) => {
  const rating = +selectedItem.rating;
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < rating ? <FaStar key={i} /> : <CiStar key={i} />
  );

  return (
    <div className={styles.ratingContainer}>
      {t("bookshelf_rating")}
      <div className={styles.stars}>{stars}</div>
    </div>
  );
};

export default function Bookshelf() {
  const reading = useGetBookshelfQuery({ status: BookStatus.READING });
  const wantToRead = useGetBookshelfQuery({ status: BookStatus.WANT_TO_READ });
  const read = useGetBookshelfQuery({ status: BookStatus.READ });
  const t = useTranslations();

  const isLoading = reading.isLoading || wantToRead.isLoading || read.isLoading;
  const isError = reading.isError || wantToRead.isError || read.isError;

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <section className={styles.errorContainer}>
        <div>{t("bookshelf_error")}</div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <ul className={styles.listContainer}>
        {Array.isArray(reading.data) && reading.data.length > 0 && (
          <li>
            <BookListPanel<BookshelfBook>
              title="Currently reading"
              books={reading.data}
              getData={getBookData}
            />
          </li>
        )}
        {Array.isArray(wantToRead.data) && wantToRead.data.length > 0 && (
          <li>
            <BookListPanel<BookshelfBook>
              title="Want to read"
              books={wantToRead.data}
              getData={getBookData}
            />
          </li>
        )}
        {Array.isArray(read.data) && read.data.length > 0 && (
          <li>
            <BookListPanel<BookshelfBook>
              title="Read"
              books={read.data}
              getData={getBookData}
              renderFooter={(selectedItem) =>
                renderRatingFooter(selectedItem, t)
              }
            />
          </li>
        )}
      </ul>
    </section>
  );
}
