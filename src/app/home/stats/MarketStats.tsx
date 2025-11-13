import { getTranslations } from "next-intl/server";
import { getMarketStats } from "./getMarketStats";
import Header from "@/components/headers/Header";
import GenreChart from "./GenreChart";
import styles from "./MarketStats.module.css";
import PieChartGraph from "@/app/statsGraphs/PieChartGraph";

export default async function MarketStats() {
  const t = await getTranslations();
  const { categoryCounts, statusCounts } = await getMarketStats();

  return (
    <section className={styles.statsContainer}>
      <Header label={t("market_marketInsights")} />
      <div className={styles.grid} id="nextstep-step6">
        <article className={styles.container}>
          <h2 className={styles.title}>{t("market_topOffersGenres")}</h2>
          <GenreChart categoryCounts={categoryCounts} />
        </article>
        <article className={styles.container}>
          <h2 className={styles.title}>{t("market_offersStatus")}</h2>
          <PieChartGraph data={statusCounts} />
        </article>
      </div>
    </section>
  );
}
