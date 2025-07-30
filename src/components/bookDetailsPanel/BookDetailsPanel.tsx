"use client";

import { ReactNode, useState } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { CiStar } from "react-icons/ci";
import styles from "./BookDetailsPanel.module.css";

import { BookMetaData } from "../bookListPanel/BookListPanel";

type BookDetailsProps<T> = {
  selectedItem: T;
  getBookData: (item: T) => BookMetaData;
  children?: ReactNode;
};

export default function BookDetails<T>({
  selectedItem,
  children,
  getBookData,
}: BookDetailsProps<T>) {
  const [showMore, setShowMore] = useState(false);
  const data = getBookData(selectedItem);

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <div className={styles.titleAuthor}>
          <p className={styles.title}>{data.title}</p>
          {data.authors?.length ? `, ${data.authors[0]}` : null}
        </div>
        <div className={styles.myBookInfo}>
          {children}
          <div className={styles.ownContainer}>
            <div
              onClick={() => setShowMore(!showMore)}
              className={styles.ownContainer}
            >
              <FaCircleInfo /> Show details <IoIosArrowDown />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${styles.detailsContainer} ${
          showMore ? styles.visible : styles.hidden
        }`}
      >
        <div className={styles.majorInfo}>
          <div className={styles.info}>
            <p className={styles.infoLabel}>authors</p>
            {data.authors?.map((a) => (
              <p key={a}>{a}</p>
            ))}
          </div>
          <div className={styles.info}>
            <p className={styles.infoLabel}>genres</p>
            {data.categories?.map((c) => (
              <p className={styles.text} key={c}>
                {c}
              </p>
            ))}
          </div>
          {data.averageRating && (
            <div className={styles.info}>
              <p className={styles.infoLabel}>rating</p>
              <div className={styles.ratingContainer}>
                <CiStar />
                <p>{data.averageRating}</p>
                {data.ratingsCount && <p>{`(${data.ratingsCount})`}</p>}
              </div>
            </div>
          )}
        </div>
        <div className={styles.majorInfo}>
          {data.publisher && (
            <div className={styles.info}>
              <p className={styles.infoLabel}>publisher</p>
              <p>{data.publisher}</p>
            </div>
          )}
          <div className={styles.info}>
            <p className={styles.infoLabel}>published date</p>
            <p>{data.publishedDate}</p>
          </div>
          <div className={styles.info}>
            <p className={styles.infoLabel}>language</p>
            <p>{data.language}</p>
          </div>
          {data.pageCount && (
            <div className={styles.info}>
              <p className={styles.infoLabel}>page count</p>
              <p>{data.pageCount}</p>
            </div>
          )}
        </div>
        <div className={styles.majorInfo}>
          <div className={styles.info}>
            {data.industryIdentifiers?.map((id) => (
              <div className={styles.info} key={id.identifier}>
                <p className={styles.infoLabel}>{id.type}</p>
                <p>{id.identifier}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.info}>
          <p className={styles.infoLabel}>description</p>
          <p
            className={`${styles.fullDescription} ${styles.scrollableElement}`}
          >
            {data.description}
          </p>
        </div>
      </div>
    </div>
  );
}
