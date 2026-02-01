import React from "react";
import { GoogleBooksVolumeInfo } from "@/interfaces/googleBooks/GoogleBooks";
import { MarketBookStatus } from "@/interfaces/MarketBook";
import { useTranslations } from "next-intl";
import { CgDetailsMore } from "react-icons/cg";
import SmallButton from "@/components/buttons/SmallButton";
import Label from "@/components/label/Label";
import styles from "./BookMarketPanel.module.css";

interface BookDetailsPageProps {
  volumeInfo: GoogleBooksVolumeInfo;
  status?: MarketBookStatus;
  onShowMore: () => void;
}

export default function BookDetailsPage({
  volumeInfo,
  status,
  onShowMore,
}: BookDetailsPageProps) {
  const t = useTranslations();
  const {
    title,
    authors,
    description,
    ratingsCount,
    averageRating,
    categories,
  } = volumeInfo;

  const renderAuthors = () => {
    return (
      <div className={styles.info}>
        <p className={styles.infoLabel}>{t("bookDetails_authors")}</p>
        {authors?.join(", ")}
      </div>
    );
  };

  const renderGenres = () => {
    return (
      <div className={styles.info}>
        <p className={styles.infoLabel}>{t("bookDetails_genres")}</p>
        {categories?.map((c) => (
          <p key={c}>{c}</p>
        ))}
      </div>
    );
  };

  const renderRating = () => {
    return (
      <div className={styles.info}>
        <p className={styles.infoLabel}>{t("bookDetails_rating")}</p>
        <div className={styles.ratingContainer}>
          <p>{averageRating ?? "-"}</p>
          {ratingsCount ? <p>{`(${ratingsCount})`}</p> : null}
        </div>
      </div>
    );
  };

  const renderDescription = () => {
    return (
      <div className={styles.info}>
        <p className={styles.infoLabel}>{t("bookDetails_description")}</p>
        <p className={styles.description}>{description ?? "-"}</p>
        {description && description?.length > 300 && (
          <div className={styles.button}>
            <SmallButton
              text={t("market_showMore")}
              icon={<CgDetailsMore />}
              ariaLabel={t("market_showMoreAria")}
              onClick={onShowMore}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <section className={styles.pageContainer}>
      <div className={styles.label}>
        <Label label={status} />
      </div>
      <span className={styles.title}>{title}</span>
      {renderAuthors()}
      {renderGenres()}
      {renderRating()}
      {renderDescription()}
    </section>
  );
}
