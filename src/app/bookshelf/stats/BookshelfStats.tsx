"use client";
import React, { useEffect, useState } from "react";
import { GoogleBooksVolumeInfo } from "@/interfaces/googleBooks/GoogleBooks";
import { useGetBookshelfQuery } from "@/api/bookshelfApi";
import { BookStatus } from "@/interfaces/BookshelfBook";
import DotGraph from "@/app/statsGraphs/DotGraph";
import HorizontalBarGraph from "@/app/statsGraphs/HorizontalBarGraph";
import PieChartGraph from "@/app/statsGraphs/PieChartGraph";
import styles from "./BookshelfStats.module.css";
import Header from "@/components/headers/Header";

function BookshelfStats() {
  const { data } = useGetBookshelfQuery({ status: BookStatus.READ });
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(
    {}
  );
  const [favoritePublisher, setFavoritePublisher] = useState<string>("");
  const [ownedBooksCount, setOwnedBooksCount] = useState<number>(0);
  const [ratingCounts, setRatingCounts] = useState<Record<string, number>>({});
  const [longestBook, setLongestBook] = useState<
    GoogleBooksVolumeInfo | undefined
  >(undefined);
  const [authorBooksCounts, setAuthorBooksCounts] = useState<
    {
      name: string;
      value: number;
    }[]
  >([]);
  const [monthlyBooksCounts, setMonthlyBooksCounts] = useState<
    {
      month: string;
      count: number;
    }[]
  >([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }

    const categoryCount: Record<string, number> = {};
    const ratingCount: Record<string, number> = {};
    const authorCount: Record<string, number> = {};
    const monthlyCount: Record<string, number> = {};
    const publisherCount: Record<string, number> = {};

    // Generate last 12 months ending with current
    const now = new Date();
    const last12Months: string[] = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString("en-US", { month: "short" });
      const key = `${monthName}`;
      last12Months.push(key);
      monthlyCount[key] = 0;
    }

    data?.forEach((item) => {
      // Categories
      item.book.volumeInfo.categories?.forEach((category) => {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });

      // Ratings
      const rating = item.rating;
      const key = `${String(rating)} ☆ `;
      ratingCount[key] = (ratingCount[key] || 0) + 1;

      // Authors
      item.book.volumeInfo.authors?.forEach((author) => {
        authorCount[author] = (authorCount[author] || 0) + 1;
      });

      // Monthly counts
      // TODO: Add createdAt to BookshelfBook
      const createdAt = new Date(item.createdAt ?? now);
      const monthKey = `${createdAt.toLocaleString("en-US", {
        month: "short",
      })}`;
      if (monthlyCount[monthKey] !== undefined) {
        monthlyCount[monthKey]++;
      }
      const monthName = createdAt.toLocaleString("default", { month: "short" });
      if (last12Months.includes(monthName)) {
        monthlyCount[monthName]++;
      }
    });

    // Pages
    const longestBook = data?.reduce((max, b) => {
      const maxPages = max?.book?.volumeInfo?.pageCount || 0;
      const currentPages = b?.book?.volumeInfo?.pageCount || 0;
      return currentPages > maxPages ? b : max;
    });

    const longestBookInfo = longestBook?.book?.volumeInfo;

    // Publisher
    data?.forEach((item) => {
      const publisher = item.book?.volumeInfo?.publisher;
      if (publisher) {
        publisherCount[publisher] = (publisherCount[publisher] || 0) + 1;
      }
    });

    const favPublisher = Object.entries(publisherCount).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];

    // Owned Books
    const ownedCount = data?.filter((item) => item.own)?.length || 0;

    const formattedAuthorsCount = Object.entries(authorCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const formattedMonthlyCount = last12Months.map((month) => ({
      month,
      count: monthlyCount[month],
    }));

    setCategoryCounts(categoryCount);
    setAuthorBooksCounts(formattedAuthorsCount);
    setRatingCounts(ratingCount);
    setMonthlyBooksCounts(formattedMonthlyCount);
    setLongestBook(longestBookInfo);
    setFavoritePublisher(favPublisher);
    setOwnedBooksCount(ownedCount);
  }, [data]);

  if (!data || !data.length) {
    return (
      <div className={styles.emptyStats}>
        Add book to the Bookshelf to expore your reading stats
      </div>
    );
  }

  return (
    <section className={styles.statsContainer}>
      <Header label="Bookshelf Insights" />
      <div className={styles.container}>
        <div className={styles.smallInsights}>
          <article className={styles.statContainer}>
            <h2 className={styles.title}>Read Books</h2>
            <p className={styles.text}>{data?.length}</p>
          </article>
          <article className={styles.statContainer}>
            <h2 className={styles.title}>Longest Book Read</h2>
            <div className={styles.textBlock}>
              <p>{`${longestBook?.title}`}</p>
              <p>{`${longestBook?.authors?.[0]}`}</p>
              <p>{`${longestBook?.pageCount} pages`}</p>
            </div>
          </article>
          <article className={styles.statContainer}>
            <h2 className={styles.title}>Owned Books</h2>
            <p className={styles.text}>{ownedBooksCount}</p>
          </article>
          <article className={styles.statContainer}>
            <h2 className={styles.title}>Favorite Publisher</h2>
            <p className={styles.text}>{favoritePublisher}</p>
          </article>
        </div>
        <div className={styles.grid}>
          <article className={styles.statContainer}>
            <h2 className={styles.title}>Top Genres</h2>
            <PieChartGraph data={categoryCounts} />
          </article>
          <article className={styles.statContainer}>
            <h2 className={styles.title}>Favorite Authors</h2>
            <HorizontalBarGraph
              data={authorBooksCounts}
              labelX="Number of Books"
              labelY="Author"
            />
          </article>
          <article className={styles.statContainer}>
            <h2 className={styles.title}>Ratings</h2>
            <PieChartGraph data={ratingCounts} />
          </article>
          <article className={styles.statContainer}>
            <h2 className={styles.title}>Reading Activity</h2>
            <DotGraph data={monthlyBooksCounts} />
          </article>
        </div>
      </div>
    </section>
  );
}

export default BookshelfStats;
