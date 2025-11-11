import React from "react";
import styles from "./BookshelfStats.module.css";
import { GoogleBooksVolumeInfo } from "@interfaces/Book";
import { getTranslations } from "next-intl/server";

interface StatsOverviewProps {
  favoritePublisher?: string;
  ownedBooksCount?: number;
  longestBook?: GoogleBooksVolumeInfo;
  readBooksCount?: number;
}

export default async function StatsOverview({
  favoritePublisher,
  ownedBooksCount,
  longestBook,
  readBooksCount,
}: StatsOverviewProps) {
  const t = await getTranslations();
  return (
    <div className={styles.smallInsights}>
      <article className={styles.statContainer}>
        <h2 className={styles.title}>{t("bookshelf_readBooks")}</h2>
        <p className={styles.text}>{readBooksCount}</p>
      </article>

      <article className={styles.statContainer}>
        <h2 className={styles.title}>{t("bookshelf_longestBook")}</h2>
        <div className={styles.textBlock}>
          <p>{longestBook?.title}</p>
          <p>{longestBook?.authors?.[0]}</p>
          <p>
            {longestBook?.pageCount} {t("bookshelf_pageCount")}
          </p>
        </div>
      </article>

      <article className={styles.statContainer}>
        <h2 className={styles.title}>{t("bookshelf_ownedBooks")}</h2>
        <p className={styles.text}>{ownedBooksCount}</p>
      </article>

      <article className={styles.statContainer}>
        <h2 className={styles.title}>{t("bookshelf_favoritePublisher")}</h2>
        <p className={styles.text}>{favoritePublisher}</p>
      </article>
    </div>
  );
}
