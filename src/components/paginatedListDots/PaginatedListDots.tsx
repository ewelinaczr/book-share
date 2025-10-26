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

  if (totalPages < 1) return null;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        aria-label={t("buttons_previousPage")}
        className={styles.button}
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <IoIosArrowBack />
      </button>

      {Array.from({ length: totalPages }, (_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            type="button"
            onClick={() => goToPage(page)}
            className={`${styles.dot} ${
              currentPage === page ? styles.active : ""
            }`}
            aria-label={`Page ${page}`}
          />
        );
      })}

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
