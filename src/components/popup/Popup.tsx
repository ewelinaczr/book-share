"use client";

import React, { useState } from "react";
import cn from "classnames";
import { IoAddSharp } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import { useTranslations } from "next-intl";
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
  const t = useTranslations();

  const renderOpenCloseButton = () => {
    return (
      <button
        type="button"
        aria-label={popupOpened ? t("popup_close") : t("popup_open")}
        aria-expanded={popupOpened}
        className={styles.openButton}
        onClick={() => setPopupOpened((prev) => !prev)}
      >
        <span className={styles.buttonIcon}>
          {popupOpened ? <IoCloseOutline /> : <IoAddSharp />}
        </span>
        <div className={styles.buttonText}>
          {popupOpened ? t("popup_close") : `${title}`}
        </div>
      </button>
    );
  };

  return (
    <>
      {renderOpenCloseButton()}
      <article
        className={cn(
          styles.container,
          popupOpened ? styles.containerVisible : styles.containerHidden
        )}
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
