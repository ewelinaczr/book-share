"use client";

import { BookshelfBook, BookStatus } from "@/interfaces/BookshelfBook";
import { useGetBookshelfQuery } from "@/api/bookshelfApi";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import BookListPanel from "@/components/bookListPanel/BookListPanel";
import styles from "./Bookshelf.module.css";

export default function Bookshelf() {
  const {
    data: readingBooks,
    isLoading: readingBooksLoading,
    isError: readingBooksError,
  } = useGetBookshelfQuery({
    status: BookStatus.READING,
  });
  const {
    data: wantToReadBooks,
    isLoading: wantToReadBooksLoading,
    isError: wantToReadBooksError,
  } = useGetBookshelfQuery({
    status: BookStatus.WANT_TO_READ,
  });
  const {
    data: readBook,
    isLoading: readBookLoading,
    isError: readBookError,
  } = useGetBookshelfQuery({ status: BookStatus.READ });

  const renderRatingFooter = (selectedItem: BookshelfBook) => {
    const rating = +selectedItem.rating;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? <FaStar key={i} /> : <CiStar key={i} />);
    }
    return (
      <div className={styles.ratingContainer}>
        Your rating<div className={styles.stars}> {stars}</div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.listContainer}>
        {readingBooks ? (
          <BookListPanel<BookshelfBook>
            title="Currently reading"
            books={readingBooks}
            getData={(item) => ({
              ...item.book.volumeInfo,
              id: item.book._id ?? "",
              imageSrc:
                item.book.volumeInfo.imageLinks?.smallThumbnail ??
                item.book.volumeInfo.imageLinks?.thumbnail ??
                null,
            })}
          />
        ) : null}
        {wantToReadBooks ? (
          <BookListPanel<BookshelfBook>
            title="Want to read"
            books={wantToReadBooks}
            getData={(item) => ({
              ...item.book.volumeInfo,
              id: item.book._id ?? "",
              imageSrc:
                item.book.volumeInfo.imageLinks?.smallThumbnail ??
                item.book.volumeInfo.imageLinks?.thumbnail ??
                null,
            })}
          />
        ) : null}
        {readBook ? (
          <BookListPanel<BookshelfBook>
            title="Read"
            books={readBook}
            getData={(item) => ({
              ...item.book.volumeInfo,
              id: item.book._id ?? "",
              imageSrc:
                item.book.volumeInfo.imageLinks?.smallThumbnail ??
                item.book.volumeInfo.imageLinks?.thumbnail ??
                null,
            })}
            renderFooter={(i: BookshelfBook) => renderRatingFooter(i)}
          />
        ) : null}
      </div>
    </div>
  );
}
