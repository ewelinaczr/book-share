"use client";
import React, { useEffect, useState } from "react";
import { CiStar } from "react-icons/ci";
import { useGetCurrentUserQuery } from "@/api/userApi";
import { useExchangeMarketBookMutation } from "@/api/marketApi";
import { MarketBook, MarketBookStatus } from "@/interfaces/MarketBook";
import { GoogleBooksVolumeInfo } from "@/interfaces/googleBooks/GoogleBooks";
import Button, { ButtonType } from "@/components/buttons/Button";
import TextArea from "@/components/textArea/TextArea";
import Label from "@/components/label/Label";
import WelcomePanel from "../welcomePanel/WelcomePanel";
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
  const marketBook = book?.book;
  const volumeInfo = marketBook?.volumeInfo;
  const ownerName = book?.ownerName;
  const status = book?.status;
  const [message, setMessage] = useState("");
  const [page, setPage] = useState<Page>(Page.BOOK_DETAILS);
  const { data } = useGetCurrentUserQuery();
  const [exchangeMarketBook] = useExchangeMarketBookMutation();

  useEffect(() => {
    if (book) {
      setPage(Page.BOOK_DETAILS);
      setMessage("");
    }
  }, [book]);

  const renderMessageOwnerSection = () => {
    return (
      <div className={styles.section}>
        <div className={styles.info}>
          <p className={styles.infoLabel}>
            Contact the owner to arrange the exchange details
          </p>
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
          />
        </div>
        <Button buttonType={ButtonType.PRIMARY}>
          {`Message ${ownerName ?? "Owner"}`}
        </Button>
      </div>
    );
  };

  const renderOfferActionSection = () => {
    if (!status) return null;
    const offer = status.charAt(0).toUpperCase() + status.slice(1);
    let text = `${offer} Book`;
    if (status === MarketBookStatus.BORROW) {
      const currentDate = new Date();
      const oneMonthLater = new Date(currentDate);
      oneMonthLater.setMonth(currentDate.getMonth() + 1);
      text = `${offer} Book for 1 month, till ${oneMonthLater.toLocaleDateString()}`;
    }
    return (
      <div className={styles.section}>
        <div className={styles.info}>
          <p className={styles.infoLabel}>{text}</p>
        </div>
        <Button buttonType={ButtonType.PRIMARY} onClick={() => exchangeBook()}>
          {`${offer} Book`}
        </Button>
      </div>
    );
  };

  const exchangeBook = () => {
    if (!data || !book?._id) {
      return;
    }
    if (data._id === book.ownerId) {
      // Can't exchange your own book
    }
    const currentDate = new Date();
    const oneMonthLater = new Date(currentDate);
    oneMonthLater.setMonth(currentDate.getMonth() + 1);
    exchangeMarketBook({
      bookId: book._id,
      status: book.status,
      date: oneMonthLater,
    });
  };

  const renderBookDetailsPage = (volumeInfo: GoogleBooksVolumeInfo) => {
    const {
      title,
      authors,
      description,
      ratingsCount,
      averageRating,
      categories,
    } = volumeInfo;
    return (
      <div className={styles.pageContainer}>
        <div className={styles.label}>
          <Label label={status} />
        </div>
        <div className={styles.info}>
          <p className={styles.title}>{title}</p>
          {authors?.map((a) => (
            <p key={a}>{a}</p>
          ))}
        </div>
        <div className={styles.info}>
          <p className={styles.infoLabel}>genres</p>
          {categories?.map((c) => (
            <p key={c}>{c}</p>
          ))}
        </div>
        <div className={styles.info}>
          <p className={styles.infoLabel}>rating</p>
          <div className={styles.ratingContainer}>
            <CiStar />
            <p>
              {averageRating ?? (
                <span className={styles.notRated}>Not rated yet</span>
              )}
            </p>
            {ratingsCount ? <p>{`(${ratingsCount})`}</p> : null}
          </div>
        </div>
        <div className={styles.info}>
          <p className={styles.infoLabel}>description</p>
          <p className={styles.description}>{description}</p>
          <span
            className={styles.showMore}
            onClick={() => setPage(Page.DESCRIPTION)}
          >
            Show more
          </span>
        </div>
      </div>
    );
  };

  const renderActionPage = (volumeInfo: GoogleBooksVolumeInfo) => {
    const { title, authors } = volumeInfo;
    return (
      <div className={styles.pageContainer}>
        <div className={styles.label}>
          <Label label={status} />
        </div>
        <div className={styles.info}>
          <p className={styles.title}>{title}</p>
          {authors?.map((a) => (
            <p key={a}>{a}</p>
          ))}
        </div>
        {renderOfferActionSection()}
        {renderMessageOwnerSection()}
      </div>
    );
  };

  const renderDescriptionPage = (volumeInfo: GoogleBooksVolumeInfo) => {
    const { description } = volumeInfo;
    return (
      <div className={styles.pageContainer}>
        <div className={styles.info}>
          <div className={styles.infoLabel}>description</div>
          <p
            className={`${styles.fullDescription} ${styles.scrollableElement}`}
          >
            {description}
          </p>
          <span
            className={styles.showMore}
            onClick={() => setPage(Page.BOOK_DETAILS)}
          >
            Go back
          </span>
        </div>
      </div>
    );
  };

  const renderPageContent = (volumeInfo: GoogleBooksVolumeInfo) => {
    switch (page) {
      case Page.DESCRIPTION:
        return renderDescriptionPage(volumeInfo);
      case Page.ACTION:
        return renderActionPage(volumeInfo);
      default:
        return renderBookDetailsPage(volumeInfo);
    }
  };

  if (volumeInfo) {
    return (
      <div className={styles.container}>
        {renderPageContent(volumeInfo)}
        <div className={styles.actionContainer}>
          <Button
            buttonType={ButtonType.PRIMARY}
            onClick={() =>
              setPage(
                page === Page.BOOK_DETAILS ? Page.ACTION : Page.BOOK_DETAILS
              )
            }
          >
            {page === Page.BOOK_DETAILS
              ? "Exchange Book"
              : "Back to Book Details"}
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <WelcomePanel />
      </div>
    );
  }
}
