"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MarketBook } from "@/interfaces/MarketBook";
import ListItem from "@/components/listItem/ListItem";
import PaginatedListDots from "@/components/paginatedListDots/PaginatedListDots";
import styles from "./MarketGrid.module.css";

const ITEM_MIN_WIDTH = 110;
const ROW_COUNT = 3;

export interface MarketGridProps {
  books: MarketBook[];
  selectItem: (item: MarketBook | null) => void;
  selectedItemId?: string;
}

export default function MarketGrid({
  books,
  selectItem,
  selectedItemId,
}: MarketGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleItemsCount, setVisibleItemsCount] = useState(1);
  const gridRef = useRef(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        const cols = Math.floor(width / ITEM_MIN_WIDTH);
        setVisibleItemsCount(cols * ROW_COUNT);
      }
    });

    if (gridRef.current) {
      resizeObserver.observe(gridRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const currentItems = useMemo(
    () =>
      books
        .filter((book) => book.book)
        .slice(
          (currentPage - 1) * visibleItemsCount,
          currentPage * visibleItemsCount
        ),
    [books, visibleItemsCount, currentPage]
  );

  return (
    <div className={styles.container}>
      <ul
        className={
          currentItems.length >= visibleItemsCount / ROW_COUNT
            ? styles.grid
            : styles.smallGrid
        }
        ref={gridRef}
      >
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
          totalPages={Math.ceil(books.length / visibleItemsCount)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
