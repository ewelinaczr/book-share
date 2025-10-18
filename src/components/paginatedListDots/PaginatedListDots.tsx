import React from "react";
import styles from "./PaginatedListDots.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

interface PaginatedListDotsProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PaginatedListDots: React.FC<PaginatedListDotsProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        aria-label="Previous page"
        className={styles.button}
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <IoIosArrowBack />
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <span
          key={i}
          onClick={() => goToPage(i + 1)}
          className={`${styles.dot} ${
            currentPage === i + 1 ? styles.active : ""
          }`}
          aria-label={`Page ${i + 1}`}
        />
      ))}

      <button
        type="button"
        aria-label="Next page"
        className={styles.button}
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default PaginatedListDots;
