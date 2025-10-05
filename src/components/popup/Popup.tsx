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

  return (
    <>
      <button
        className={styles.openButton}
        onClick={() => setPopupOpened((prev) => !prev)}
      >
        <span className={styles.buttonIcon}>
          {popupOpened ? <IoCloseOutline /> : <IoAddSharp />}
        </span>
        <div className={styles.buttonText}>
          {popupOpened ? "Close" : "Add Book Offer to the Market"}
        </div>
      </button>
      <div
        className={`${
          popupOpened ? styles.containerVisible : styles.containerHidden
        } ${styles.container}`}
      >
        <div className={styles.popup}>
          <Header label={title} />
          {children}
        </div>
      </div>
    </>
  );
}
