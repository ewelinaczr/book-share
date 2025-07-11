import styles from "./BookDetails.module.css";
import { FaCircleInfo } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { CiStar } from "react-icons/ci";
import { BookshelfBook } from "@/interfaces/BookshelfBook";
import { MarketBook } from "@/interfaces/MarketBook";
import { ReactNode } from "react";

export type BookDetailItem = BookshelfBook | MarketBook;

export default function BookDetails<T extends BookDetailItem>({
  selectedItem,
  children,
}: {
  selectedItem: T;
  children?: ReactNode;
}) {
  if (!selectedItem) return null;
  return (
    <>
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <p className={styles.title}>{selectedItem.book.volumeInfo.title}</p>
          <div className={styles.myBookInfo}>
            {children}
            <div className={styles.ownContainer}>
              <FaCircleInfo /> Show details <IoIosArrowDown />
            </div>
          </div>
        </div>
        <div className={styles.detailsContainer}>
          <div className={styles.majorInfo}>
            <div className={styles.info}>
              <p className={styles.infoLabel}>authors</p>
              {selectedItem.book.volumeInfo.authors?.map((a) => (
                <p key={a}>{a}</p>
              ))}
            </div>
            <div className={styles.info}>
              <p className={styles.infoLabel}>genres</p>
              {selectedItem.book.volumeInfo.categories?.map((c) => (
                <p className={styles.text} key={c}>
                  {c}
                </p>
              ))}
            </div>
            {selectedItem.book.volumeInfo.averageRating ? (
              <div className={styles.info}>
                <p className={styles.infoLabel}>rating</p>
                <div className={styles.ratingContainer}>
                  <CiStar />
                  <p>{selectedItem.book.volumeInfo.averageRating}</p>
                  {selectedItem.book.volumeInfo.ratingsCount ? (
                    <p>{`(${selectedItem.book.volumeInfo.ratingsCount})`}</p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
          <div className={styles.majorInfo}>
            {selectedItem.book.volumeInfo.publisher ? (
              <div className={styles.info}>
                <p className={styles.infoLabel}>publisher</p>
                <p>{selectedItem.book.volumeInfo.publisher}</p>
              </div>
            ) : null}
            <div className={styles.info}>
              <p className={styles.infoLabel}>published date</p>
              <p>{selectedItem.book.volumeInfo.publishedDate}</p>
            </div>
            <div className={styles.info}>
              <p className={styles.infoLabel}>language</p>
              <p>{selectedItem.book.volumeInfo.language}</p>
            </div>
            {selectedItem.book.volumeInfo.pageCount ? (
              <div className={styles.info}>
                <p className={styles.infoLabel}>page count</p>
                <p>{selectedItem.book.volumeInfo.pageCount}</p>
              </div>
            ) : null}
          </div>
          <div className={styles.majorInfo}>
            <div className={styles.info}>
              {selectedItem.book.volumeInfo.industryIdentifiers?.map((c) => (
                <div className={styles.info} key={c.identifier}>
                  <p className={styles.infoLabel}>{c.type}</p>
                  <p>{c.identifier}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.info}>
            <p className={styles.infoLabel}>description</p>
            <p className={styles.description}>
              {selectedItem.book.volumeInfo.description}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
