"use client";
import cn from "classnames";
import { useTranslations } from "next-intl";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import styles from "./PaginatedListDots.module.css";

interface PaginatedListDotsProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function PaginatedListDots({
  totalPages,
  currentPage,
  onPageChange,
}: PaginatedListDotsProps) {
  const t = useTranslations();

  if (totalPages <= 1) return null;

  // --- SLIDING WINDOW LOGIC ---
  const maxVisibleDots = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisibleDots / 2));
  let endPage = startPage + maxVisibleDots - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisibleDots + 1);
  }

  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className={styles.pagination}>
      {/* Previous Button */}
      <button
        type="button"
        aria-label={t("buttons_previousPage")}
        className={styles.button}
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <IoIosArrowBack />
      </button>

      {/* Visible Dot Window */}
      {visiblePages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => goToPage(page)}
          className={cn(styles.dot, {
            [styles.active]: currentPage === page,
          })}
          aria-label={`Page ${page}`}
          aria-current={currentPage === page ? "page" : undefined}
        />
      ))}

      {/* Next Button */}
      <button
        type="button"
        aria-label={t("buttons_nextPage")}
        className={styles.button}
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
}
