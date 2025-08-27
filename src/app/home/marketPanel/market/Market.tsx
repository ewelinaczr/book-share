"use client";

import { useEffect, useState } from "react";
import { useGetAllMarketBooksQuery } from "@/api/marketApi";
import { MarketBook, MarketBookStatus } from "@/interfaces/MarketBook";
import { BookMarketPanel } from "../browseOffersPanel/BookMarketPanel";
import MarketGrid from "../grid/MarketGrid";
import styles from "./Market.module.css";
import Search from "../search/Search";
import Header from "@/components/headers/Header";

function useMarketByStatus(status?: MarketBookStatus) {
  const { data, isLoading, isError, error } = useGetAllMarketBooksQuery({
    status,
  });
  return { data, isLoading, isError, error };
}

function filterBooks(
  books: MarketBook[],
  query: string,
  category: string
): MarketBook[] {
  return books.filter((book) => {
    const title = book.book?.volumeInfo?.title?.toLowerCase() || "";
    const authors = book.book?.volumeInfo?.authors || [];
    const categories = book.book?.volumeInfo?.categories || [];

    const matchesTitle = title.includes(query.toLowerCase());
    const matchesAuthor = authors.some((author) =>
      author.toLowerCase().includes(query.toLowerCase())
    );
    const matchesCategory =
      category === "All Genres" ||
      categories.some((c) => c.toLowerCase().includes(category.toLowerCase()));

    return (matchesTitle || matchesAuthor) && matchesCategory;
  });
}

export function Market() {
  const { data, isLoading, isError, error } = useMarketByStatus();
  const [marketBooks, setMarketBooks] = useState<MarketBook[]>([]);
  const [displayedBook, setDisplayedBook] = useState<MarketBook | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("All Genres");

  useEffect(() => {
    // Update book list on databese, search query or category filter change
    if (!data) return;

    const booksToDisplay =
      !searchQuery && searchCategory === "All Genres"
        ? data
        : filterBooks(data, searchQuery, searchCategory);
    setMarketBooks(booksToDisplay);
    setDisplayedBook(booksToDisplay.find((d) => d.book) ?? null);
  }, [data, searchQuery, searchCategory]);

  if (isLoading) return <div>Loading...</div>;

  if (isError)
    return (
      <div>
        Error loading bookshelf.
        <br />
        {JSON.stringify(error)}
      </div>
    );

  const renderEmptyMarket = () => {
    if (marketBooks.length > 0) return;
    return (
      <div className={styles.emptyMarket}>
        No books found. Try to change cryteria.
      </div>
    );
  };

  return (
    <div className={styles.marketPanelContainer}>
      <Header label={"Explore books in the Market"} />
      <Search
        books={data}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
      />
      {renderEmptyMarket()}
      <div className={styles.gridPanelContainer}>
        <MarketGrid
          books={marketBooks}
          selectItem={(item: MarketBook | null) => setDisplayedBook(item)}
          selectedItemId={displayedBook?.book._id}
        />
        {displayedBook ? <BookMarketPanel book={displayedBook} /> : null}
      </div>
    </div>
  );
}
