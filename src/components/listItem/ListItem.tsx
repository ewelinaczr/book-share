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
    <li>
      <button
        type="button"
        onClick={() => selectItem(item)}
        aria-pressed={selected}
        aria-label={`${title} ${selected ? "selected" : ""}`}
        className={`${styles.container} ${selected ? styles.selected : ""}`}
      >
        {imageSrc ? (
          <div className={styles.imageWrapper}>
            <Image
              src={imageSrc}
              alt={title}
              fill
              sizes="(max-width: 600px) 100px, 128px"
              style={{ objectFit: "contain" }}
            />
          </div>
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderText}>{title}</span>
          </div>
        )}
        {renderLabel ? renderLabel(item) : null}
      </button>
    </li>
  );
}
