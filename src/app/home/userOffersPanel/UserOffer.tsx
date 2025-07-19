"use client";

import List from "@/components/list/List";
import { useState } from "react";

import { MarketBook } from "@/interfaces/MarketBook";
import { FaBookOpen } from "react-icons/fa";
import styles from "./UserOffers.module.css";

import ListItem from "@/components/listItem/ListItem";
import Header from "@/components/headers/Header";
import BookDetails from "@/components/bookDetailsPanel/BookDetailsPanel";
import ProgressBar from "@/components/progressBar/ProgressBar";

type UserOfferProps = {
  title: string;
  books: MarketBook[];
};

export default function UserOffer({ books, title }: UserOfferProps) {
  const [selectedItem, setSelectedItem] = useState<MarketBook | null>(null);

  const today = new Date();
  const tenDaysLater = new Date();
  const tenDaysBefore = new Date();
  tenDaysLater.setDate(today.getDate() + 10);
  tenDaysBefore.setDate(today.getDate() - 3);

  return (
    <div className={styles.container}>
      <div className={styles.listContainer}>
        {books ? (
          <>
            <div className={styles.header}>
              <Header label={title} />
            </div>
            <div className={styles.list}>
              {books.length !== 0 ? (
                <List
                  items={books}
                  renderItem={(i: MarketBook) =>
                    i.book?._id ? (
                      <div className={styles.itemContainer}>
                        <ListItem<MarketBook>
                          key={i.book._id}
                          item={i}
                          selected={selectedItem?.book._id === i.book._id}
                          selectItem={(i) => {
                            console.log(i.book.volumeInfo.title);
                            setSelectedItem(i);
                          }}
                          getTitle={(i) => i.book.volumeInfo.title}
                          getImageSrc={(i) =>
                            i.book.volumeInfo.imageLinks?.smallThumbnail ??
                            i.book.volumeInfo.imageLinks?.thumbnail ??
                            null
                          }
                        />
                        <ProgressBar
                          deadline={tenDaysLater.toDateString()}
                          startDate={tenDaysBefore.toDateString()}
                        />
                      </div>
                    ) : null
                  }
                />
              ) : (
                <div className={styles.emptyList}>List is empty</div>
              )}
            </div>
            {selectedItem ? (
              <BookDetails selectedItem={selectedItem}>
                <div>
                  <div className={styles.statusContainer}>
                    <FaBookOpen />
                    {selectedItem.status}
                  </div>
                  {selectedItem.deadline &&
                    new Date(selectedItem.deadline).toLocaleDateString()}
                </div>
              </BookDetails>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
