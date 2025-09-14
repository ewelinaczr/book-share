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
    <div className={styles.statsContainer}>
      <Header label="Market Insights" />
      <div className={styles.grid}>
        <div className={styles.container}>
          <p className={styles.title}>Top Offers Genres</p>
          <PieChartGraph data={categoryCounts} outerRadius={80} height={300} />
        </div>
        <div className={styles.container}>
          <p className={styles.title}>Offers Status</p>
          <PieChartGraph data={statusCounts} />
        </div>
      </div>
    </div>
  );
}

export default MarketStats;
