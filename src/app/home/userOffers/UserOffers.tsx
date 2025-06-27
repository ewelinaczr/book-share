"use client";

import List from "@/components/list/List";
import {
  useGetBorrowedBooksQuery,
  useGetBorrowedFromMeQuery,
  useGetUserMarketBooksQuery,
} from "@/api/marketApi";
import { MarketBook } from "@/interfaces/MarketBook";
import ListItem from "@/components/listItem/ListItem";

export default function UserOffers() {
  const { data: borrowedBooks } = useGetBorrowedBooksQuery();
  const { data: borrowedFromMeBooks } = useGetBorrowedFromMeQuery();
  const { data: myBooks } = useGetUserMarketBooksQuery({});

  return (
    <>
      {myBooks ? (
        <List
          title="My Listed Market Books/ to borrow"
          items={myBooks}
          renderItem={(item: MarketBook) =>
            item.book?._id ? (
              <ListItem key={item.book._id} item={item.book} />
            ) : null
          }
        />
      ) : null}
      {borrowedBooks ? (
        <List
          title="Borrowed"
          items={borrowedBooks}
          renderItem={(item: MarketBook) =>
            item.book?._id ? (
              <ListItem key={item.book._id} item={item.book} />
            ) : null
          }
        />
      ) : null}
      {borrowedFromMeBooks ? (
        <List
          title="Borrowed from Me"
          items={borrowedFromMeBooks}
          renderItem={(item: MarketBook) =>
            item.book?._id ? (
              <ListItem key={item.book._id} item={item.book} />
            ) : null
          }
        />
      ) : null}
    </>
  );
}
