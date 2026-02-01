"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRequestExchangeMutation } from "@/api/marketApi";
import { MarketBook } from "@/interfaces/MarketBook";
import { useTranslations } from "next-intl";
import { useBookSocket } from "./useBookSocket";
import { toast } from "react-toastify";
import BookDetailsPage from "./BookDetailsPage";
import ActionPage from "./ActionPage";
import DescriptionPage from "./DescriptionPage";
import WelcomePanel from "../welcomePanel/WelcomePanel";
import Button, { ButtonType } from "@/components/buttons/Button";
import styles from "./BookMarketPanel.module.css";

export interface BookMarketPanelProps {
  book: MarketBook | null;
}

enum Page {
  BOOK_DETAILS = "bookDetails",
  ACTION = "action",
  DESCRIPTION = "description",
}

export function BookMarketPanel({ book }: BookMarketPanelProps) {
  const t = useTranslations();
  const [page, setPage] = useState<Page>(Page.BOOK_DETAILS);
  const [requestExchange, { isSuccess, isError, error }] =
    useRequestExchangeMutation();
  const { data: session } = useSession();
  const socketRef = useBookSocket(session);

  useEffect(() => {
    if (book) {
      setPage(Page.BOOK_DETAILS);
    }
  }, [book]);

  const requestExchangeBook = () => {
    if (!session || !book?._id) return;
    requestExchange({
      bookId: book._id,
      status: book.status,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(t("requests_sent"));
    }
    if (isError) {
      toast.error(t("requests_send_error"));
    }
  }, [isSuccess, isError, error]);

  const marketBook = book?.book;
  const volumeInfo = marketBook?.volumeInfo;
  const ownerName = book?.ownerName;
  const ownerId = book?.ownerId?.toString();
  const currentUserId = session?.user.id;
  const status = book?.status;

  if (!volumeInfo) return <WelcomePanel />;

  return (
    <div className={styles.container}>
      {page === Page.DESCRIPTION ? (
        <DescriptionPage
          volumeInfo={volumeInfo}
          onGoBack={() => setPage(Page.BOOK_DETAILS)}
        />
      ) : page === Page.ACTION ? (
        <ActionPage
          volumeInfo={volumeInfo}
          status={status}
          ownerName={ownerName}
          ownerId={ownerId}
          currentUserId={currentUserId}
          socketRef={socketRef}
          onExchange={requestExchangeBook}
        />
      ) : (
        <BookDetailsPage
          volumeInfo={volumeInfo}
          status={status}
          onShowMore={() => setPage(Page.DESCRIPTION)}
        />
      )}
      <div className={styles.actionContainer}>
        <Button
          type="submit"
          ariaLabel={t("buttons_toggleTheme")}
          buttonType={
            page === Page.BOOK_DETAILS
              ? ButtonType.PRIMARY
              : ButtonType.SECONDARY
          }
          onClick={() =>
            setPage(
              page === Page.BOOK_DETAILS ? Page.ACTION : Page.BOOK_DETAILS
            )
          }
        >
          {page === Page.BOOK_DETAILS
            ? t("market_offerAction")
            : t("market_backToDetails")}
        </Button>
      </div>
    </div>
  );
}
