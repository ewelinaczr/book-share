import React from "react";
import { IBookshelfBook } from "@interfaces/BookshelfBook";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { useTranslations } from "next-intl";
import styles from "./Bookshelf.module.css";

export function RatingFooter({
  selectedItem,
}: {
  selectedItem: IBookshelfBook;
}) {
  const t = useTranslations();
  const rating = +selectedItem.rating;
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < rating ? <FaStar key={i} /> : <CiStar key={i} />
  );

  return (
    <div className={styles.ratingContainer}>
      {t("bookshelf_rating")}
      <div className={styles.stars}>{stars}</div>
    </div>
  );
}
