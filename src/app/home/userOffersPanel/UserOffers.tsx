"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  useGetBorrowedBooksQuery,
  useGetBorrowedFromMeQuery,
  useGetUserMarketBooksQuery,
} from "@/api/marketApi";
import styles from "./UserOffers.module.css";
import MyOffersPanel from "./MyOffersPanel";
import BorrowedPanel from "./BorrowedPanel";
import BorrowedFromMePanel from "./BorrowedFromMePanel";

export default function UserOffers() {
  const t = useTranslations();
  const { data: session } = useSession();

  const { data: myBooks } = useGetUserMarketBooksQuery({});
  const { data: borrowedBooks } = useGetBorrowedBooksQuery();
  const { data: borrowedFromMeBooks } = useGetBorrowedFromMeQuery();

  if (!session) {
    return <p className={styles.emptyContainer}>{t("login_title")}</p>;
  }

  return (
    <section className={styles.container}>
      <ul className={styles.listContainer}>
        {myBooks && (
          <li>
            <MyOffersPanel books={myBooks} />
          </li>
        )}
        {borrowedBooks && (
          <li>
            <BorrowedPanel books={borrowedBooks} />
          </li>
        )}
        {borrowedFromMeBooks && (
          <li>
            <BorrowedFromMePanel books={borrowedFromMeBooks} />
          </li>
        )}
      </ul>
    </section>
  );
}
