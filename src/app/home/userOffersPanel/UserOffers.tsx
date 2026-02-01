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
import Link from "next/link";
import Button, { ButtonType } from "@/components/buttons/Button";

export default function UserOffers() {
  const t = useTranslations();
  const [itemToEdit, setItemToEdit] = useState<string | null>(null);
  const { data: session } = useSession();
  const user = session?.user;

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
    Boolean,
  );

  const renderErrorMesage = () => {
    if (!isError) return null;

    return (
      <div className={styles.errorContainer}>
        {!user ? (
          <div className={styles.loginPrompt}>
            <div>{t("market_logInToUse")}</div>
            <Link href="/login" prefetch={false}>
              <Button
                type="button"
                ariaLabel={t("navigation_logIn")}
                buttonType={ButtonType.SECONDARY}
                customStyles={{ minWidth: "10rem" }}
              >
                {t("navigation_logIn")}
              </Button>
            </Link>
          </div>
        ) : (
          <div>{t("market_loadingError")}</div>
        )}
      </div>
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

  return (
    <section className={styles.container}>
      <Header label={t("market_myOffers")} />
      {renderLoadingSpinner()}
      {renderErrorMesage()}
      {renderUserOffers()}
    </section>
  );
}
