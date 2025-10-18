"use client";
import React, { useEffect, useState } from "react";
import { useGetAllMarketBooksQuery } from "@/api/marketApi";
import PieChartGraph from "@/app/statsGraphs/PieChartGraph";
import Header from "@/components/headers/Header";
import styles from "./MarketStats.module.css";

function MarketStats() {
  const { data } = useGetAllMarketBooksQuery({});
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(
    {}
  );
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const categoryCount: Record<string, number> = {};
    const statusCount: Record<string, number> = {};

    data?.forEach((item) => {
      if (!item.book?.volumeInfo) return;
      // Categories
      item.book?.volumeInfo.categories?.forEach((category) => {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });

      // Status
      const status = item.status;
      const key = `${
        String(status).charAt(0).toUpperCase() + String(status).slice(1)
      }`;
      statusCount[key] = (statusCount[key] || 0) + 1;
    });

    setCategoryCounts(categoryCount);
    setStatusCounts(statusCount);
  }, [data]);

  return (
    <section className={styles.statsContainer}>
      <Header label="Market Insights" />
      <div className={styles.grid}>
        <article className={styles.container}>
          <h2 className={styles.title}>Top Offers Genres</h2>
          <PieChartGraph data={categoryCounts} outerRadius={80} />
        </article>
        <article className={styles.container}>
          <h2 className={styles.title}>Offers Status</h2>
          <PieChartGraph data={statusCounts} />
        </article>
      </div>
    </section>
  );
}

export default MarketStats;
