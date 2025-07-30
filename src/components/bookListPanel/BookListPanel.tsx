"use client";

import { useState } from "react";
import styles from "./BookListPanel.module.css";

import List from "@/components/list/List";
import ListItem from "@/components/listItem/ListItem";
import BookDetails from "@/components/bookDetailsPanel/BookDetailsPanel";

export interface BookMetaData {
  id: string;
  title: string;
  imageSrc: string | null;
  authors?: string[];
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  publisher?: string;
  publishedDate?: string;
  language?: string;
  pageCount?: number;
  description?: string;
  industryIdentifiers?: { type: string; identifier: string }[];
}

type BookListPanelProps<T> = {
  title: string;
  books: T[];
  renderLabel?: (item: T) => React.ReactNode;
  renderFooter?: (item: T) => React.ReactNode;
  getData: (item: T) => BookMetaData;
};

export default function BookListPanel<T>({
  title,
  books,
  renderLabel,
  renderFooter,
  getData,
}: BookListPanelProps<T>) {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  return (
    <div className={styles.container}>
      <div className={styles.listContainer}>
        {books.length === 0 ? (
          <div className={styles.emptyList}>List is empty</div>
        ) : (
          <>
            <div className={styles.header}>
              <span className={styles.title}>{title}</span>
            </div>
            <div className={styles.list}>
              <List
                items={books}
                renderItem={(item) => {
                  const { id, title, imageSrc } = getData(item);
                  return (
                    <div className={styles.itemContainer} key={id}>
                      <ListItem<T>
                        item={item}
                        selected={
                          selectedItem ? getData(selectedItem).id === id : false
                        }
                        selectItem={setSelectedItem}
                        getTitle={() => title}
                        getImageSrc={() => imageSrc}
                        renderLabel={renderLabel}
                      />
                    </div>
                  );
                }}
              />
            </div>
            {selectedItem && (
              <BookDetails<T> selectedItem={selectedItem} getBookData={getData}>
                {renderFooter?.(selectedItem)}
              </BookDetails>
            )}
          </>
        )}
      </div>
    </div>
  );
}
