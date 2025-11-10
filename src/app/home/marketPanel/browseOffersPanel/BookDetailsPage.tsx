import React from "react";
import { GoogleBooksVolumeInfo } from "@interfaces/Book";
import { MarketBookStatus } from "@interfaces/MarketBook";
import { CiStar } from "react-icons/ci";
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

  return (
    <section className={styles.pageContainer}>
      <div className={styles.label}>
        <Label label={status} />
      </div>
      <div className={styles.info}>
        <p className={styles.title}>{title}</p>
        {authors?.map((a) => (
          <p key={a}>{a}</p>
        ))}
      </div>
      <div className={styles.info}>
        <p className={styles.infoLabel}>{t("bookDetails_genres")}</p>
        {categories?.map((c) => (
          <p key={c}>{c}</p>
        ))}
      </div>
      <div className={styles.info}>
        <p className={styles.infoLabel}>{t("bookDetails_rating")}</p>
        <div className={styles.ratingContainer}>
          <CiStar />
          <p>
            {averageRating ?? (
              <span className={styles.notRated}>
                {t("bookDetails_notRated")}
              </span>
            )}
          </p>
          {ratingsCount ? <p>{`(${ratingsCount})`}</p> : null}
        </div>
      </div>
      <div className={styles.info}>
        <p className={styles.infoLabel}>{t("bookDetails_description")}</p>
        <p className={styles.description}>{description}</p>
        <div className={styles.button}>
          <SmallButton
            text={t("market_showMore")}
            icon={<CgDetailsMore />}
            ariaLabel={t("market_showMoreAria")}
            onClick={onShowMore}
          />
        </div>
      </div>
    </section>
  );
}
