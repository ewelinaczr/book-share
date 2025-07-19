"use client";
import React, { useState } from "react";
import styles from "./MarketPanel.module.css";
import { CiStar } from "react-icons/ci";
import { MarketBook } from "@/interfaces/MarketBook";
import Label from "@/components/label/Label";
import Button, { ButtonType } from "@/components/buttons/Button";
import TextArea from "@/components/textArea/TextArea";

export interface MapPopupProps {
  book: MarketBook | null;
}

export function MarketPanel({ book }: MapPopupProps) {
  const marketBook = book?.book;
  const owner = book?.ownerId;
  const status = book?.status;
  const [message, setMessage] = useState("");

  if (marketBook?.volumeInfo) {
    const {
      title,
      authors,
      description,
      ratingsCount,
      averageRating,
      categories,
    } = marketBook?.volumeInfo;
    return (
      <div className={styles.container}>
        <div>
          <div className={styles.majorInfo}>
            <div className={styles.titleContainer}>
              <p className={styles.title}>{title}</p>
              {authors?.map((a) => (
                <p key={a}>{a}</p>
              ))}
            </div>
            <Label label={status} />
          </div>
          <div className={styles.info}>
            <p className={styles.infoLabel}>genres</p>
            {categories?.map((c) => (
              <p key={c}>{c}</p>
            ))}
          </div>
          {averageRating ? (
            <div className={styles.info}>
              <p className={styles.infoLabel}>rating</p>
              <div className={styles.ratingContainer}>
                <CiStar />
                <p>{averageRating}</p>
                {ratingsCount ? <p>{`(${ratingsCount})`}</p> : null}
              </div>
            </div>
          ) : null}
          <div className={styles.info}>
            <p className={styles.infoLabel}>description</p>
            <p className={styles.description}>{description}</p>
          </div>
        </div>
        <div className={styles.contact}>
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
          <Button className={styles.button} buttonType={ButtonType.PRIMARY}>
            Message OwnerName
          </Button>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
