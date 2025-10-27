import React from "react";
import DotGraph from "@/app/statsGraphs/DotGraph";
import HorizontalBarGraph from "@/app/statsGraphs/HorizontalBarGraph";
import PieChartGraph from "@/app/statsGraphs/PieChartGraph";
import styles from "./BookshelfStats.module.css";

interface ChartsProps {
  authorBooksCounts?: { name: string; value: number }[];
  categoryCounts?: Record<string, number>;
  ratingCounts?: Record<string, number>;
  monthlyBooksCounts?: { month: string; count: number }[];
  t: (key: string) => string;
}

export default function Charts({
  authorBooksCounts,
  categoryCounts,
  ratingCounts,
  monthlyBooksCounts,
  t,
}: ChartsProps) {
  if (
    !categoryCounts ||
    !authorBooksCounts ||
    !ratingCounts ||
    !monthlyBooksCounts
  ) {
    return null;
  }
  return (
    <div className={styles.grid}>
      {
        <article className={styles.statContainer}>
          <h2 className={styles.title}>{t("bookshelf_topGenres")}</h2>
          <PieChartGraph data={categoryCounts} />
        </article>
      }

      <article className={styles.statContainer}>
        <h2 className={styles.title}>{t("bookshelf_favoriteAuthors")}</h2>
        <HorizontalBarGraph
          data={authorBooksCounts}
          labelX={t("bookshelf_booksCount")}
          labelY={t("bookshelf_author")}
        />
      </article>

      <article className={styles.statContainer}>
        <h2 className={styles.title}>{t("bookshelf_ratings")}</h2>
        <PieChartGraph data={ratingCounts} />
      </article>

      <article className={styles.statContainer}>
        <h2 className={styles.title}>{t("bookshelf_readingActivity")}</h2>
        <DotGraph data={monthlyBooksCounts} />
      </article>
    </div>
  );
}
