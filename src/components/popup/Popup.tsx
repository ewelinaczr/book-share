"use client";

import React, { useState } from "react";
import { IoAddSharp } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import styles from "./Popup.module.css";

import Header from "@/components/headers/Header";

export default function Popup({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const [popupOpened, setPopupOpened] = useState<boolean>(false);

  const renderOpenCloseButton = () => {
    return (
      <button
        type="button"
        aria-label={popupOpened ? "Close popup" : "Open popup"}
        aria-expanded={popupOpened}
        className={styles.openButton}
        onClick={() => setPopupOpened((prev) => !prev)}
      >
        <span className={styles.buttonIcon}>
          {popupOpened ? <IoCloseOutline /> : <IoAddSharp />}
        </span>
        <div className={styles.buttonText}>
          {popupOpened ? "Close" : `${title}`}
        </div>
      </button>
    );
  };

  return (
    <>
      {renderOpenCloseButton()}
      <article
        className={`${
          popupOpened ? styles.containerVisible : styles.containerHidden
        } ${styles.container}`}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`popup-title-${title.replace(/\s+/g, "-")}`}
          className={styles.popup}
        >
          <div id={`popup-title-${title.replace(/\s+/g, "-")}`}>
            <Header label={title} />
          </div>
          {children}
        </div>
      </article>
    </>
  );
}
