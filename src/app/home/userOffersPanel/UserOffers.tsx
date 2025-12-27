"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import {
  useGetBorrowedBooksQuery,
  useGetBorrowedFromMeQuery,
  useGetUserMarketBooksQuery,
} from "@/api/marketApi";
import styles from "./UserOffers.module.css";

import MyOffersPanel from "./MyOffersPanel";
import BorrowedPanel from "./BorrowedPanel";
import BorrowedFromMePanel from "./BorrowedFromMePanel";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import Header from "@/components/headers/Header";
import EditPopup from "./EditPopup";
import LogInRedirect from "@/components/loginRedirect/LogInRedirect";

export default function UserOffers() {
  const t = useTranslations();
  const [itemToEdit, setItemToEdit] = useState<string | null>(null);
  const { data: session } = useSession();
  const currentUserId = session?.user.id;

  const {
    data: myBooks,
    isLoading: myBooksLoading,
    isError: myBooksError,
  } = useGetUserMarketBooksQuery({});

  const {
    data: borrowedBooks,
    isLoading: borrowedBooksLoading,
    isError: borrowedBooksError,
  } = useGetBorrowedBooksQuery();

  const {
    data: borrowedFromMeBooks,
    isLoading: borrowedFromMeLoading,
    isError: borrowedFromMeError,
  } = useGetBorrowedFromMeQuery();

  const isLoading = [
    myBooksLoading,
    borrowedBooksLoading,
    borrowedFromMeLoading,
  ].some(Boolean);
  const isError = [myBooksError, borrowedBooksError, borrowedFromMeError].some(
    Boolean
  );

  const renderErrorMesage = () => {
    if (isError)
      return (
        <div className={styles.errorContainer}>{t("market_loadingError")}</div>
      );
  };

  const renderLoadingSpinner = () => {
    if (isLoading) {
      return (
        <div className={styles.loaderContainer}>
          <LoadingSpinner />
        </div>
      );
    }
  };

  const renderUserOffers = () => {
    return (
      <>
        <ul>
          {myBooks && (
            <li>
              <MyOffersPanel books={myBooks} setItemToEdit={setItemToEdit} />
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
        {itemToEdit ? (
          <EditPopup bookId={itemToEdit} onClose={() => setItemToEdit(null)} />
        ) : null}
      </>
    );
  };

  if (!currentUserId) {
    return (
      <section className={styles.container}>
        <Header label={t("market_myOffers")} />
        <LogInRedirect />
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <Header label={t("market_myOffers")} />
      {renderLoadingSpinner()}
      {renderErrorMesage()}
      {renderUserOffers()}
    </section>
  );
}
