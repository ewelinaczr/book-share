import React from "react";
import Book from "@/interfaces/Book";
import Image from "next/image";

interface ListItemProps {
  item: Book;
}

export default function ListItem({ item }: ListItemProps) {
  const { title, authors, ratingsCount, averageRating, imageLinks } =
    item.volumeInfo;
  return (
    <div>
      {imageLinks?.smallThumbnail || imageLinks?.thumbnail ? (
        <Image
          src={imageLinks.smallThumbnail ?? imageLinks.thumbnail ?? ""}
          alt={title}
          width={100}
          height={150}
        />
      ) : null}
      {title}
      {authors}
      {averageRating}
      {ratingsCount}
    </div>
  );
}
