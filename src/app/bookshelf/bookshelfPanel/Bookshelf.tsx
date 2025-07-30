"use client";

import { BookshelfBook, BookStatus } from "@/interfaces/BookshelfBook";
import { useGetBookshelfQuery } from "@/api/bookshelfApi";
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
          />
        ) : null}
      </div>
    </div>
  );
}
