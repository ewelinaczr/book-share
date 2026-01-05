"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Button, { ButtonType } from "@/components/buttons/Button";
import { useAcceptExchangeMutation } from "@/api/marketApi";
import { useRouter } from "next/navigation";
import { MarketBook, RequestMarketBook } from "@/interfaces/MarketBook";
import { toast } from "react-toastify";
import styles from "./RequestCard.module.css";

function IncomingRequestCard({
  request,
  book,
}: {
  request: RequestMarketBook;
  book: MarketBook;
}) {
  const { title, imageLinks, authors } = book.book.volumeInfo;
  const imageSrc = imageLinks?.smallThumbnail ?? imageLinks?.thumbnail;
  const t = useTranslations();
  const [acceptExchange, { isLoading: isAccepting }] =
    useAcceptExchangeMutation();
  const router = useRouter();

  const renderActions = () => {
    return (
      <div className={styles.actions}>
        <Button
          buttonType={ButtonType.PRIMARY}
          type="submit"
          ariaLabel="Accept Request"
          customStyles={{ minWidth: "14rem" }}
          onClick={() => {
            if (!book._id || !request._id) return;
            acceptExchange({
              bookId: book._id as string,
              requestId: request._id as string,
              decision: "accept",
            })
              .unwrap()
              .then(() => {
                toast.success(t("requests_acceptSuccess"));
              })
              .catch(() => toast.error(t("requests_acceptError")));
          }}
          disabled={isAccepting}
        >
          {t("requests_acceptRequest")}
        </Button>
        <Button
          buttonType={ButtonType.SECONDARY}
          type="submit"
          ariaLabel="Decline Request"
          customStyles={{ minWidth: "14rem" }}
          onClick={() => {
            if (!book._id || !request._id) return;
            acceptExchange({
              bookId: book._id as string,
              requestId: request._id as string,
              decision: "decline",
            })
              .unwrap()
              .then(() => {
                toast.success(t("requests_declineSuccess"));
              })
              .catch(() => toast.error(t("requests_declineError")));
          }}
          disabled={isAccepting}
        >
          {t("requests_declineRequest")}
        </Button>

        <Button
          buttonType={ButtonType.SECONDARY}
          type="submit"
          ariaLabel="Message Requester"
          customStyles={{ whiteSpace: "nowrap", minWidth: "14rem" }}
          onClick={() => {
            const requesterId = request?.userId?._id;
            if (!requesterId) return;
            router.push(`/chat?user=${requesterId}`);
          }}
        >
          {t("requests_message_requester")}
        </Button>
      </div>
    );
  };

  const renderBookInfo = () => {
    return (
      <div className={styles.bookInfoContainer}>
        <div className={styles.info}>
          <p className={styles.infoLabel}>{t("bookDetails_title")}</p>
          <p>{title}</p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoLabel}>{t("bookDetails_authors")}</p>
          <p>{authors?.join(", ")}</p>
        </div>
      </div>
    );
  };

  const renderImage = () => {
    return imageSrc ? (
      <div className={styles.imageWrapper}>
        <Image
          src={imageSrc}
          alt={title}
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
    ) : (
      <div className={styles.placeholder}>
        <span className={styles.placeholderText}>{title}</span>
      </div>
    );
  };

  const renderRequestInfo = () => {
    return (
      <div className={styles.requestInfo}>
        <div className={styles.info}>
          <p className={styles.infoLabel}>{t("requests_requestTitle")}</p>
          <p>
            {t("requests_requestFrom", {
              action: request.status,
              user: request.userId.name ?? "",
            })}
          </p>
        </div>
        <div>
          <p className={styles.infoLabel}>{t("requests_submittedAt")}</p>
          <p>{new Date(request.date).toLocaleDateString()}</p>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.cardContainer}>
      {renderImage()}
      <div className={styles.infoContainer}>
        {renderBookInfo()}
        <div className={styles.requestInfoContainer}>
          {renderRequestInfo()}
          {renderActions()}
        </div>
      </div>
    </div>
  );
}

export default IncomingRequestCard;
