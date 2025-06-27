import React from "react";
import styles from "./List.module.css";

interface ListProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ title, items, renderItem }: ListProps<T>) {
  return (
    <div>
      <h2>{title}</h2>
      <div className={styles.listContainer}>
        {items.map((item, index) => (
          <div key={index}>{renderItem(item)}</div>
        ))}
      </div>
    </div>
  );
}

export default List;
