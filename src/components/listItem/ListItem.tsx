import React from "react";
import Book from "@/interfaces/Book";
import Image from "next/image";

interface ListItemProps {
  item: Book;
}

export default function ListItem({ item }: ListItemProps) {
  return (
    <div>
      <Image
        src={`/covers/${item.isbn}.jpg`}
        alt={item.title}
        width={100}
        height={150}
      />
      {item.title}
      {item.authors}
      {item.average_rating}
      {item.ratings_count}
    </div>
  );
}
