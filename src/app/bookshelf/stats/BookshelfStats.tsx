import { getTranslations } from "next-intl/server";
import { getBookshelfStats } from "./getBookshelfStats";
import StatsOverview from "./StatsOverview";
import Header from "@/components/headers/Header";
import Charts from "./Charts";
import styles from "./BookshelfStats.module.css";

export default async function BookshelfStats() {
  const t = await getTranslations();

  const {
    categoryCounts,
    ratingCounts,
    authorBooksCounts,
    monthlyBooksCounts,
    favoritePublisher,
    ownedBooksCount,
    longestBook,
    readBooksCount,
  } = await getBookshelfStats();

  return (
    <section className={styles.statsContainer}>
      <Header label={t("bookshelf_insights")} />
      <div className={styles.container}>
        <StatsOverview
          favoritePublisher={favoritePublisher}
          ownedBooksCount={ownedBooksCount}
          longestBook={longestBook}
          readBooksCount={readBooksCount}
          t={t}
        />
        <Charts
          authorBooksCounts={authorBooksCounts}
          categoryCounts={categoryCounts}
          ratingCounts={ratingCounts}
          monthlyBooksCounts={monthlyBooksCounts}
          t={t}
        />
      </div>
    </section>
  );
}
