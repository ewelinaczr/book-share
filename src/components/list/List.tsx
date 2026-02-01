import React, { useEffect, useRef, useState } from "react";
import styles from "./List.module.css";
import cn from "classnames";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);
  const [listWidth, setListWidth] = useState<number | string>("100%");

  const checkScrollLimits = () => {
    if (listRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = listRef.current;

      setCanScrollLeft(scrollLeft > 5);

      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 15;
      setCanScrollRight(!isAtEnd);
    }
  };

  useEffect(() => {
    const updateLayout = () => {
      if (scrollRef.current && listRef.current) {
        const parentWidth = scrollRef.current.offsetWidth;
        const firstItem = listRef.current.children[0] as HTMLElement;

        if (firstItem) {
          const childWidth = firstItem.offsetWidth;
          const gap = 30;
          const maxBooksToDisplay = Math.floor(
            parentWidth / (childWidth + gap),
          );

          if (maxBooksToDisplay > 0) {
            setListWidth(maxBooksToDisplay * (childWidth + gap));
          }
        }
        setTimeout(checkScrollLimits, 50);
      }
    };

    const observer = new ResizeObserver(updateLayout);
    if (scrollRef.current) observer.observe(scrollRef.current);

    updateLayout();
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    const list = listRef.current;
    if (list) {
      list.addEventListener("scroll", checkScrollLimits);
      checkScrollLimits();
    }
    return () => list?.removeEventListener("scroll", checkScrollLimits);
  }, [items]);

  const scrollLeft = () => {
    if (!listRef.current) return;
    listRef.current.scrollBy({
      left: -listRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!listRef.current) return;

    const { scrollLeft, clientWidth, scrollWidth } = listRef.current;
    if (scrollLeft + clientWidth >= scrollWidth - 15) return;

    listRef.current.scrollBy({
      left: listRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.scrollWrapper} ref={scrollRef}>
      {canScrollLeft ? (
        <button
          type="button"
          aria-label="Show previous page"
          onClick={scrollLeft}
          className={styles.arrow}
        >
          <IoIosArrowBack />
        </button>
      ) : (
        <div className={styles.arrowPlaceholder} />
      )}

      <ul
        className={styles.listContainer}
        ref={listRef}
        role="list"
        style={{ width: listWidth }}
      >
        {items.map((item, index) => (
          <div key={index}>{renderItem(item)}</div>
        ))}
      </ul>

      {canScrollRight ? (
        <button
          type="button"
          aria-label="Show next page"
          onClick={scrollRight}
          className={cn(styles.arrow, styles.arrowRight)}
        >
          <IoIosArrowForward />
        </button>
      ) : (
        <div className={cn(styles.arrowPlaceholder, styles.arrowRight)} />
      )}
    </div>
  );
}

export default List;
