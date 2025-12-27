"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { MarketBook } from "@/interfaces/MarketBook";
import { useMarketByStatus } from "./useMarketByStatus";
import { filterBooks } from "./filterBooks";
import { BookMarketPanel } from "../browseOffersPanel/BookMarketPanel";
import Header from "@/components/headers/Header";
import Search from "../search/Search";
import MarketGrid from "../grid/MarketGrid";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import styles from "./Market.module.css";

export default function Market() {
  const { data, isLoading, isError } = useMarketByStatus();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("allGenres");
  const [displayedBook, setDisplayedBook] = useState<MarketBook | null>(null);
  const t = useTranslations();

  const marketBooks = useMemo(() => {
    if (!data) return [];
    if (!searchQuery && searchCategory === "allGenres") return data;
    return filterBooks(data, searchQuery, searchCategory, t);
  }, [data, searchQuery, searchCategory, t]);

  useEffect(() => {
    if (marketBooks.length > 0 && !displayedBook) {
      setDisplayedBook(marketBooks.find((d) => d.book) ?? null);
    }
  }, [marketBooks, displayedBook]);

  const renderErrorMesage = () => {
    if (isError) return <div>{t("market_loadingError")}</div>;
  };

  const renderLoadingSpinner = () => {
    if (isLoading) {
      return (
        <div className={styles.loaderContainer}>
          <LoadingSpinner />
        </div>
      );
    }
  };

  const renderEmptyMarketMessage = () => {
    if (!marketBooks.length) {
      return (
        <div className={styles.emptyMarket}>{t("market_noBooksFound")}</div>
      );
    }
  };

  const renderMarketGrid = () => {
    if (marketBooks.length) {
      return (
        <div className={styles.gridPanelContainer}>
          <MarketGrid
            books={marketBooks}
            selectItem={setDisplayedBook}
            selectedItemId={displayedBook?.book._id}
          />
          {displayedBook && <BookMarketPanel book={displayedBook} />}
        </div>
      );
    }
  };

  return (
    <section className={styles.marketPanelContainer} id="nextstep-step7">
      <Header label={t("market_exploreMarketBooks")} />
      <Search
        books={data}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
      />
      {renderLoadingSpinner()}
      {renderErrorMesage()}
      {renderEmptyMarketMessage()}
      {renderMarketGrid()}
    </section>
  );
}
