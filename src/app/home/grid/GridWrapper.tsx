"use client";

import { MarketBook } from "@/interfaces/MarketBook";
import ListItem from "@/components/listItem/ListItem";

export interface marketGridProps {
  books: MarketBook[];
}

export default function MarketGrid({ books }: marketGridProps) {
  return (
    <>
      <div>
        {books?.map((i) => (
          <ListItem key={i.book._id} item={i.book} />
        ))}
      </div>
    </>
  );
}
