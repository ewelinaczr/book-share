"use client";

import { useState } from "react";
import { MarketBook } from "@/interfaces/MarketBook";
import ListItem from "@/components/listItem/ListItem";
import PaginatedListDots from "@/components/paginatedListDots/PaginatedListDots";
import styles from "./MarketGrid.module.css";

export interface MarketGridProps {
  books: MarketBook[];
  selectItem: (item: MarketBook) => void;
  selectedItemId?: string;
}

export default function MarketGrid({
  books,
  selectItem,
  selectedItemId,
}: MarketGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(books.length / 18);

  const currentItems = books
    .filter((book) => book.book)
    .slice((currentPage - 1) * 18, currentPage * 18);

  return (
    <div className={styles.container}>
      <ul className={styles.grid}>
        {currentItems?.map((i) => {
          if (!i.book) {
            return null;
          }
          return (
            <ListItem<MarketBook>
              key={i.book._id}
              item={i}
              selectItem={selectItem}
              selected={selectedItemId === i.book._id}
              getTitle={(i) => i.book.volumeInfo.title}
              getImageSrc={(i) =>
                i.book.volumeInfo.imageLinks?.smallThumbnail ??
                i.book.volumeInfo.imageLinks?.thumbnail ??
                null
              }
            />
          );
        })}
      </ul>
      <div className={styles.dots}>
        <PaginatedListDots
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
