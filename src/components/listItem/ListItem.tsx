import React from "react";
import cn from "classnames";
import Image from "next/image";
import styles from "./ListItem.module.css";

interface ListItemProps<T> {
  item: T;
  selected: boolean;
  selectItem: (item: T) => void;
  getTitle: (item: T) => string;
  getImageSrc: (item: T) => string | null;
  renderLabel?: (item: T) => React.ReactNode;
  renderEditButton?: (item: T) => React.ReactNode;
  renderDeleteButton?: (item: T) => React.ReactNode;
  renderMessageButton?: (item: T) => React.ReactNode;
}

export default function ListItem<T>({
  item,
  selected,
  selectItem,
  getTitle,
  getImageSrc,
  renderLabel,
  renderEditButton,
  renderDeleteButton,
  renderMessageButton,
}: ListItemProps<T>) {
  const title = getTitle(item);
  const imageSrc = getImageSrc(item);

  const renderActionButtons = () => {
    return (
      <div
        className={cn(styles.editDeleteButtons, {
          [styles.editDeleteButtonsSelected]: selected,
        })}
      >
        {renderEditButton && renderEditButton(item)}
        {renderDeleteButton && renderDeleteButton(item)}
        {renderMessageButton && renderMessageButton(item)}
      </div>
    );
  };

  return (
    <li>
      <button
        type="button"
        onClick={() => selectItem(item)}
        aria-pressed={selected}
        aria-label={`${title} ${selected ? "selected" : ""}`}
        className={cn(styles.container, { [styles.selected]: selected })}
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
        {renderLabel ? (
          <div className={styles.labelContainer}>{renderLabel(item)}</div>
        ) : null}
        {renderActionButtons()}
      </button>
    </li>
  );
}
