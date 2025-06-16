import React from "react";
import Book from "@/interfaces/Book";
import ListItem from "../listItem/ListItem";
import styles from "./List.module.css";

interface ListProps {
  title: string;
  items: Book[];
}

function List({ title, items }: ListProps) {
  return (
    <div>
      <h2>{title}</h2>
      <div className={styles.listContainer}>
        {items.map((item: Book) => (
          <ListItem key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default List;
