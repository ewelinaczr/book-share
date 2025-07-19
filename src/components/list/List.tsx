import React, { useRef } from "react";
import styles from "./List.module.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -130, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 130, behavior: "smooth" });
  };

  return (
    <div className={styles.scrollWrapper}>
      <button onClick={scrollLeft} className={styles.arrow}>
        <IoIosArrowBack />
      </button>
      <div className={styles.listContainer} ref={scrollRef}>
        {items.map((item, index) => (
          <div key={index}>{renderItem(item)}</div>
        ))}
      </div>
      <button onClick={scrollRight} className={styles.arrow}>
        <IoIosArrowForward />
      </button>
    </div>
  );
}

export default List;
