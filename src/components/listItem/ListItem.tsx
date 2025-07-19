import React from "react";
import Image from "next/image";
import styles from "./ListItem.module.css";

interface ListItemProps<T> {
  item: T;
  selectItem: (item: T) => void;
  getTitle: (item: T) => string;
  getImageSrc: (item: T) => string | null;
  selected: boolean;
}

export default function ListItem<T>({
  item,
  selectItem,
  getTitle,
  getImageSrc,
  selected,
}: ListItemProps<T>) {
  const title = getTitle(item);
  const imageSrc = getImageSrc(item);
  return (
    <div
      onClick={() => {
        console.log(item);
        selectItem(item);
      }}
      className={`${styles.container} ${selected ? styles.selected : ""}`}
    >
      {imageSrc ? (
        <Image src={imageSrc} alt={title} width={100} height={150} />
      ) : (
        <div className={styles.placeholder}>
          <span className={styles.placeholderText}>{title}</span>
        </div>
      )}
    </div>
  );
}
