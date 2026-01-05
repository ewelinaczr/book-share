"use client";

import { ReactNode, useState, useMemo } from "react";
import cn from "classnames";
import { FaCircleInfo } from "react-icons/fa6";
import { CiStar } from "react-icons/ci";
import { useTranslations } from "next-intl";
import styles from "./BookDetailsPanel.module.css";

import { BookMetaData } from "../bookListPanel/BookListPanel";
import SmallButton from "../buttons/SmallButton";

type BookDetailsProps<T> = {
  selectedItem: T;
  getBookData: (item: T) => BookMetaData;
  children?: ReactNode;
  renderFooter?: (selectedItem: T) => ReactNode;
};

const InfoBlock = ({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn(styles.info, className)}>
    <p className={styles.infoLabel}>{label}</p>
    {children}
  </div>
);

export default function BookDetails<T>({
  selectedItem,
  children,
  getBookData,
  renderFooter,
}: BookDetailsProps<T>) {
  const [showMore, setShowMore] = useState(false);
  const t = useTranslations();

  // Memoize data so it only recalculates if the item changes
  const data = useMemo(
    () => getBookData(selectedItem),
    [selectedItem, getBookData]
  );

  const toggleLabel = showMore
    ? t("bookDetails_hideDetails")
    : t("bookDetails_showDetails");

  return (
    <div className={styles.container}>
      {/* HEADER SECTION */}
      <div className={styles.titleContainer}>
        <div className={styles.titleAuthor}>
          <p className={styles.title}>{data.title}</p>
          <p className={styles.separator}>{t("bookDetails_separator")}</p>
          {data.authors?.length ? `${data.authors[0]}` : null}
        </div>
        <div className={styles.myBookInfo}>{children}</div>
      </div>

      {/* COLLAPSIBLE DETAILS SECTION */}
      <div
        id="book-details"
        className={cn(
          styles.detailsContainer,
          showMore ? styles.visible : styles.hidden
        )}
      >
        <div className={styles.majorInfo}>
          <InfoBlock label={t("bookDetails_authors")}>
            {data.authors?.map((author, idx) => (
              <p key={`${author}-${idx}`}>{author}</p>
            ))}
          </InfoBlock>

          <InfoBlock label={t("bookDetails_genres")}>
            {data.categories?.map((cat, idx) => (
              <p className={styles.text} key={`${cat}-${idx}`}>
                {cat}
              </p>
            ))}
          </InfoBlock>

          {data.averageRating && (
            <InfoBlock label={t("bookDetails_rating")}>
              <div className={styles.ratingContainer}>
                <CiStar />
                <p>{data.averageRating}</p>
                {data.ratingsCount && <p>{`(${data.ratingsCount})`}</p>}
              </div>
            </InfoBlock>
          )}
        </div>

        <div className={styles.majorInfo}>
          {data.publisher && (
            <InfoBlock label={t("bookDetails_publisher")}>
              <p>{data.publisher}</p>
            </InfoBlock>
          )}
          <InfoBlock label={t("bookDetails_publishedDate")}>
            <p>{data.publishedDate}</p>
          </InfoBlock>
          <InfoBlock label={t("bookDetails_language")}>
            <p>{data.language}</p>
          </InfoBlock>
          {data.pageCount && (
            <InfoBlock label={t("bookDetails_pageCount")}>
              <p>{data.pageCount}</p>
            </InfoBlock>
          )}
        </div>

        <div className={styles.majorInfo}>
          {data.industryIdentifiers?.map((id) => (
            <InfoBlock key={id.identifier} label={id.type}>
              <p>{id.identifier}</p>
            </InfoBlock>
          ))}
        </div>

        <InfoBlock label={t("bookDetails_description")}>
          <p className={cn(styles.fullDescription, styles.scrollableElement)}>
            {data.description}
          </p>
        </InfoBlock>
      </div>

      {/* FOOTER SECTION */}
      <div className={styles.buttonContainer}>
        {renderFooter?.(selectedItem)}
        <SmallButton
          ariaLabel={toggleLabel}
          text={toggleLabel}
          icon={<FaCircleInfo />}
          onClick={() => setShowMore(!showMore)}
        />
      </div>
    </div>
  );
}
