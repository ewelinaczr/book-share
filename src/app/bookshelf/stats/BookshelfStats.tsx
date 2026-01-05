import { getTranslations } from "next-intl/server";
import { getBookshelfStats } from "./getBookshelfStats";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/config";
import StatsOverview from "./StatsOverview";
import Header from "@/components/headers/Header";
import Charts from "./Charts";
import styles from "./BookshelfStats.module.css";

export default async function BookshelfStats() {
  const t = await getTranslations();
  const books = await getBookshelfStats();
  const session = await getServerSession(authConfig);
  const isLoggedInUser = Boolean(session?.user?.id);

  const {
    categoryCounts,
    ratingCounts,
    authorBooksCounts,
    monthlyBooksCounts,
    favoritePublisher,
    ownedBooksCount,
    longestBook,
    readBooksCount,
  } = books ?? {};

  if (!isLoggedInUser) {
    return null;
  }

  return (
    <section className={styles.statsContainer}>
      <Header label={t("bookshelf_insights")} />
      <div className={styles.container} id="nextstep-step10">
        {!books ? (
          <span className={styles.emptyStats}>{t("bookshelf_emptyStats")}</span>
        ) : (
          <>
            <StatsOverview
              favoritePublisher={favoritePublisher}
              ownedBooksCount={ownedBooksCount}
              longestBook={longestBook}
              readBooksCount={readBooksCount}
            />
            <Charts
              authorBooksCounts={authorBooksCounts}
              categoryCounts={categoryCounts}
              ratingCounts={ratingCounts}
              monthlyBooksCounts={monthlyBooksCounts}
            />
          </>
        )}
      </div>
    </section>
  );
}
