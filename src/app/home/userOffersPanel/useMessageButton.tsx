import React from "react";
import Link from "next/link";
import { LiaUser } from "react-icons/lia";
import styles from "./Buttons.module.css";

export function useMessageButton<U>(getMessageText?: (book: U) => string) {
  const renderMessageButton = (book: U) => {
    return (
      <div className={styles.buttonMessage}>
        {getMessageText ? (
          <p className={styles.message}>{getMessageText(book)}</p>
        ) : null}
        <Link href={"/chat"}>
          <div
            className={styles.button}
            aria-label="contact book owner/borrower"
          >
            <LiaUser />
          </div>
        </Link>
      </div>
    );
  };

  return { renderMessageButton };
}
