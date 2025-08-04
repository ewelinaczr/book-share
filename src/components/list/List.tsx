import React, { useEffect, useRef, useState } from "react";
import styles from "./List.module.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState<boolean>(false);
  const [listWidth, setListWidth] = useState<number>(0);

  useEffect(() => {
    if (scrollRef.current && listRef.current) {
      const parentWidth = scrollRef.current.offsetWidth;
      const firstItem = listRef.current.children[0] as HTMLElement;

      if (firstItem) {
        const childWidth = firstItem.offsetWidth;
        const maxBooksToDisplay = Math.floor(parentWidth / (childWidth + 30));
        setListWidth(maxBooksToDisplay * (childWidth + 30));
        setShowArrows(items.length > maxBooksToDisplay);
      }
    }
  }, [items]);

  const scrollLeft = () => {
    listRef.current?.scrollBy({ left: -130, behavior: "smooth" });
  };

  const scrollRight = () => {
    listRef.current?.scrollBy({ left: 130, behavior: "smooth" });
  };

  return (
    <div className={styles.scrollWrapper} ref={scrollRef}>
      {showArrows ? (
        <button onClick={scrollLeft} className={styles.arrow}>
          <IoIosArrowBack />
        </button>
      ) : (
        <div className={styles.arrow} />
      )}
      <div
        className={styles.listContainer}
        ref={listRef}
        style={{ width: `${listWidth}px` }}
      >
        {items.map((item, index) => (
          <div key={index}>{renderItem(item)}</div>
        ))}
      </div>
      {showArrows ? (
        <button onClick={scrollRight} className={styles.arrow}>
          <IoIosArrowForward />
        </button>
      ) : (
        <div className={styles.arrow} />
      )}
    </div>
  );
}

export default List;
