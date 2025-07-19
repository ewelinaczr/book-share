"use client";

import List from "@/components/list/List";
import { BookshelfBook, BookStatus } from "@/interfaces/BookshelfBook";
import { useState } from "react";
import { useGetBookshelfQuery } from "@/api/bookshelfApi";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa6";
import { FaBookOpen } from "react-icons/fa";
import Header from "@/components/headers/Header";
import ListItem from "@/components/listItem/ListItem";
import BookDetails from "@/components/bookDetailsPanel/BookDetailsPanel";
import styles from "./Bookshelf.module.css";

function useBookshelfByStatus(status: BookStatus) {
  const { data, isLoading, isError, error } = useGetBookshelfQuery({ status });
  return { data, isLoading, isError, error };
}

export default function Bookshelf() {
  const reading = useBookshelfByStatus(BookStatus.READING);
  const wantToRead = useBookshelfByStatus(BookStatus.WANT_TO_READ);
  const read = useBookshelfByStatus(BookStatus.READ);

  const bookshelfData = [
    { title: "Currently Reading", ...reading },
    { title: "Want to Read", ...wantToRead },
    { title: "Read", ...read },
  ];

  const isLoading = bookshelfData.some((cat) => cat.isLoading);
  const isError = bookshelfData.some((cat) => cat.isError);
  const errorDetails = bookshelfData.find((cat) => cat.isError);

  const [selectedItem, setSelectedItem] = useState<BookshelfBook | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div>
        Error loading bookshelf.
        <br />
        {JSON.stringify(errorDetails?.error)}
      </div>
    );

  return (
    <>
      {bookshelfData.map(({ title }, idx) => (
        <div>
          <Header label={title} />
          <List
            key={title}
            items={bookshelfData[idx].data ? bookshelfData[idx].data : []}
            renderItem={(i: BookshelfBook) => (
              <div className={styles.itemContainer}>
                <ListItem
                  key={i.book._id}
                  item={i}
                  selected={selectedItem?.book._id === i.book._id}
                  selectItem={(i) => {
                    console.log(i.book.volumeInfo.title);
                    setSelectedItem(i);
                  }}
                  getTitle={(i) => i.book.volumeInfo.title}
                  getImageSrc={(i) =>
                    i.book.volumeInfo.imageLinks?.smallThumbnail ??
                    i.book.volumeInfo.imageLinks?.thumbnail ??
                    null
                  }
                />
              </div>
            )}
          />
          {selectedItem ? (
            <BookDetails selectedItem={selectedItem}>
              <div>
                {Array.from({ length: 5 }, (_, i) => {
                  const a = selectedItem.rating as number;
                  if (i < a) {
                    return <FaStar key={i} />;
                  }
                  return <CiStar key={i} />;
                })}
              </div>
              <div className={styles.ownContainer}>
                <FaBookOpen />
                {selectedItem.own ? "I own this book" : "I don't own this book"}
              </div>
            </BookDetails>
          ) : null}
        </div>
      ))}
    </>
  );
}
