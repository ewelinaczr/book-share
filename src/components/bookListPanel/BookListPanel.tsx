"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
  borrowerName?: string;
}

type BookListPanelProps<T> = {
  title: string;
  books: T[];
  renderLabel?: (item: T) => React.ReactNode;
  renderFooter?: (item: T) => React.ReactNode;
  renderEditButton?: (item: T) => React.ReactNode;
  renderDeleteButton?: (item: T) => React.ReactNode;
  renderMessageButton?: (item: T) => React.ReactNode;
  getData: (item: T) => BookMetaData;
};

export default function BookListPanel<T>({
  title,
  books,
  renderLabel,
  renderFooter,
  renderEditButton,
  renderDeleteButton,
  renderMessageButton,
  getData,
}: BookListPanelProps<T>) {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const t = useTranslations();

  const renderEmptyList = () => {
    return (
      <>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
        </div>
        <div className={styles.emptyList}>{t("market_emptyList")}</div>
      </>
    );
  };

  return (
    <div className={styles.container}>
      {books.length === 0 ? (
        renderEmptyList()
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
                      renderEditButton={renderEditButton}
                      renderDeleteButton={renderDeleteButton}
                      renderMessageButton={renderMessageButton}
                    />
                  </div>
                );
              }}
            />
          </div>
          {selectedItem ? (
            <BookDetails<T>
              selectedItem={selectedItem}
              getBookData={getData}
              renderFooter={renderFooter}
            ></BookDetails>
          ) : (
            <div className={styles.noSelectedItem}>
              {t("market_chooseBook")}
            </div>
          )}
        </>
      )}
    </div>
  );
}
