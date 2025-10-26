"use client";
import React, { useEffect, useRef, useState } from "react";
import { CiStar } from "react-icons/ci";
import { useSession } from "next-auth/react";
import { useExchangeMarketBookMutation } from "@/api/marketApi";
import { MarketBook, MarketBookStatus } from "@/interfaces/MarketBook";
import { GoogleBooksVolumeInfo } from "@/interfaces/googleBooks/GoogleBooks";
import { io, Socket } from "socket.io-client";
import { useDispatch } from "react-redux";
// Local type for private messages (avoids dependency on external file)
type PrivateMessage = {
  from: string;
  to: string;
  message: string;
  timestamp: string;
};
import { CgDetailsMore } from "react-icons/cg";
import { useTranslations } from "next-intl";
import { IoIosArrowBack } from "react-icons/io";
import Button, { ButtonType } from "@/components/buttons/Button";
import TextArea from "@/components/textArea/TextArea";
import Label from "@/components/label/Label";
import WelcomePanel from "../welcomePanel/WelcomePanel";
import styles from "./BookMarketPanel.module.css";
import SmallButton from "@/components/buttons/SmallButton";

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
  const marketBook = book?.book;
  const volumeInfo = marketBook?.volumeInfo;
  const ownerName = book?.ownerName;
  const status = book?.status;
  const [message, setMessage] = useState("");
  const [page, setPage] = useState<Page>(Page.BOOK_DETAILS);
  const [exchangeMarketBook] = useExchangeMarketBookMutation();
  const socketRef = useRef<Socket | null>(null);
  const { data: session } = useSession();
  const currentUserId = session?.user.id;
  const dispatch = useDispatch();

  useEffect(() => {
    if (book) {
      setPage(Page.BOOK_DETAILS);
      setMessage("");
    }
  }, [book]);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io("http://localhost:4000", {
      auth: {
        accessToken: session?.token,
      },
    });
    return () => {
      socketRef.current?.disconnect();
    };
  }, [session]);

  const sendMessage = () => {
    if (message.trim() && book?.ownerId.toString() && currentUserId) {
      const newMessage: PrivateMessage = {
        from: currentUserId,
        to: book.ownerId.toString(),
        message: message,
        timestamp: new Date().toISOString(),
      };

      socketRef.current?.emit("private message", newMessage);
      setMessage("");
    }
  };

  const renderMessageOwnerSection = () => {
    return (
      <div className={styles.section}>
        <div className={styles.info}>
          <p className={styles.infoLabel}>{t("market_contactOwner")}</p>
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("market_typeYourMessage")}
          />
        </div>
        <Button
          type="submit"
          ariaLabel={t("chat_sendToOwnerAria")}
          buttonType={ButtonType.PRIMARY}
          onClick={sendMessage}
        >
          {ownerName ? t("market_messageOwner", { owner: ownerName }) : ""}
        </Button>
      </div>
    );
  };

  const renderOfferActionSection = () => {
    if (!status) return null;
    const offer = status.charAt(0).toUpperCase() + status.slice(1);
    let text = t("market_offerBook", { offer });
    if (status === MarketBookStatus.BORROW) {
      const currentDate = new Date();
      const oneMonthLater = new Date(currentDate);
      oneMonthLater.setMonth(currentDate.getMonth() + 1);

      const text = t("market_offerBookForDuration", {
        offer,
        duration: "1 month",
        endDate: oneMonthLater.toLocaleDateString() ?? "",
      });
    }
    return (
      <div className={styles.section}>
        <div className={styles.info}>
          <p className={styles.infoLabel}>{text}</p>
        </div>
        <Button
          type="submit"
          ariaLabel={t("buttons_addBookToMarket")}
          buttonType={ButtonType.PRIMARY}
          onClick={() => exchangeBook()}
        >
          {offer}
        </Button>
      </div>
    );
  };

  const exchangeBook = () => {
    if (!session || !book?._id) {
      return;
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
      <section className={styles.pageContainer}>
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
          <p className={styles.infoLabel}>{t("bookDetails_genres")}</p>
          {categories?.map((c) => (
            <p key={c}>{c}</p>
          ))}
        </div>
        <div className={styles.info}>
          <p className={styles.infoLabel}>{t("bookDetails_rating")}</p>
          <div className={styles.ratingContainer}>
            <CiStar />
            <p>
              {averageRating ?? (
                <span className={styles.notRated}>
                  {t("bookDetails_notRated")}
                </span>
              )}
            </p>
            {ratingsCount ? <p>{`(${ratingsCount})`}</p> : null}
          </div>
        </div>
        <div className={styles.info}>
          <p className={styles.infoLabel}>{t("bookDetails_description")}</p>
          <p className={styles.description}>{description}</p>
          <div className={styles.button}>
            <SmallButton
              text={t("market_showMore")}
              icon={<CgDetailsMore />}
              ariaLabel={t("market_showMoreAria")}
              onClick={() => setPage(Page.DESCRIPTION)}
            />
          </div>
        </div>
      </section>
    );
  };

  const renderActionPage = (volumeInfo: GoogleBooksVolumeInfo) => {
    const { title, authors } = volumeInfo;
    return (
      <section className={styles.pageContainer}>
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
      </section>
    );
  };

  const renderDescriptionPage = (volumeInfo: GoogleBooksVolumeInfo) => {
    const { description } = volumeInfo;
    return (
      <section className={styles.pageContainer}>
        <div className={styles.info}>
          <div className={styles.infoLabel}>{t("bookDetails_description")}</div>
          <p
            className={`${styles.fullDescription} ${styles.scrollableElement}`}
          >
            {description}
          </p>
          <div className={styles.button}>
            <SmallButton
              text={t("buttons_goBack")}
              icon={<IoIosArrowBack />}
              ariaLabel={t("buttons_goBackToDetails")}
              onClick={() => setPage(Page.BOOK_DETAILS)}
            />
          </div>
        </div>
      </section>
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
            type="submit"
            ariaLabel={t("buttons_toggleTheme")}
            buttonType={ButtonType.PRIMARY}
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
  } else {
    return (
      <div className={styles.container}>
        <WelcomePanel />
      </div>
    );
  }
}
