import React from "react";
import Image from "next/image";
import styles from "./ListItem.module.css";

interface ListItemProps<T> {
  item: T;
  selected: boolean;
  selectItem: (item: T) => void;
  getTitle: (item: T) => string;
  getImageSrc: (item: T) => string | null;
  renderLabel?: (item: T) => React.ReactNode;
}

export default function ListItem<T>({
  item,
  selected,
  selectItem,
  getTitle,
  getImageSrc,
  renderLabel,
}: ListItemProps<T>) {
  const title = getTitle(item);
  const imageSrc = getImageSrc(item);
  return (
    <div
      onClick={() => {
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
      {renderLabel ? renderLabel(item) : null}
    </div>
  );
}
