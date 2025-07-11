"use client";

import {
  useGetBorrowedBooksQuery,
  useGetBorrowedFromMeQuery,
  useGetUserMarketBooksQuery,
} from "@/api/marketApi";

import styles from "./UserOffers.module.css";

import UserOffer from "./UserOffer";

export default function UserOffers() {
  const { data: borrowedBooks } = useGetBorrowedBooksQuery();
  const { data: borrowedFromMeBooks } = useGetBorrowedFromMeQuery();
  const { data: myBooks } = useGetUserMarketBooksQuery({});

  return (
    <div className={styles.container}>
      <div className={styles.listContainer}>
        {myBooks ? (
          <UserOffer title="My Market Offers" books={myBooks} />
        ) : null}
        {borrowedBooks ? (
          <UserOffer title="Borrowed Books" books={borrowedBooks} />
        ) : null}
        {borrowedFromMeBooks ? (
          <UserOffer
            title="Books borowed from Me"
            books={borrowedFromMeBooks}
          ></UserOffer>
        ) : null}
      </div>
    </div>
  );
}
