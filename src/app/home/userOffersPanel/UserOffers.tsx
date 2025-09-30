"use client";

import {
  useGetBorrowedBooksQuery,
  useGetBorrowedFromMeQuery,
  useGetUserMarketBooksQuery,
} from "@/api/marketApi";
import { FaBookOpen } from "react-icons/fa6";
import { MarketBook } from "@/interfaces/MarketBook";
import { useSession } from "next-auth/react";
import SmallLabel from "@/components/label/SmallLabel";
import styles from "./UserOffers.module.css";

import BookListPanel from "@/components/bookListPanel/BookListPanel";

export default function UserOffers() {
  const { data: session } = useSession();
  const {
    data: myBooks,
    isLoading: myBooksLoading,
    isError: myBooksError,
  } = useGetUserMarketBooksQuery({});
  const {
    data: borrowedBooks,
    isLoading: borrowedBooksLoading,
    isError: borrowedBooksError,
  } = useGetBorrowedBooksQuery();
  const {
    data: borrowedFromMeBooks,
    isLoading: borrowedFromMeBooksLoading,
    isError: borrowedFromMeBooksError,
  } = useGetBorrowedFromMeQuery();

  const renderProgressLabel = (i: MarketBook) => {
    const oneMonthBefore = new Date(i.exchangedWith.date);
    oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1);

    const today = new Date();
    const start = new Date(oneMonthBefore);
    const end = new Date(i.exchangedWith.date);
    const totalMs = end.getTime() - start.getTime();
    const elapsedMs = today.getTime() - start.getTime();

    const totalDays = Math.ceil(totalMs / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.max(
      0,
      Math.ceil(elapsedMs / (1000 * 60 * 60 * 24))
    );
    const daysLeft = Math.max(0, totalDays - elapsedDays);
    const a = daysLeft === 0 ? "Overdue" : `${daysLeft} days left`;
    return <SmallLabel label={a} />;
  };

  const renderStatusLabel = (i: MarketBook) => {
    return (
      <SmallLabel
        label={`To ${
          i.status
            ? i.status?.charAt(0).toUpperCase() + i.status?.slice(1)
            : null
        }`}
      />
    );
  };

  const renderOfferTypeFooter = (selectedItem: MarketBook) => {
    const offetType = selectedItem
      ? `To ${
          selectedItem?.status.charAt(0).toUpperCase() +
          selectedItem?.status.slice(1)
        }`
      : null;

    return (
      <div>
        <div className={styles.statusContainer}>
          <FaBookOpen />
          {`Offer type: ${offetType}`}
        </div>
        {selectedItem.deadline &&
          new Date(selectedItem.deadline).toLocaleDateString()}
      </div>
    );
  };

  const renderMessageOwnerFooter = (selectedItem: MarketBook) => {
    const ownerName = selectedItem.ownerName ?? "UserName";
    const deadline = selectedItem.deadline
      ? `until ${new Date(selectedItem.deadline).toLocaleDateString()}`
      : "";
    return (
      <div>
        <div className={styles.statusContainer}>
          <FaBookOpen />
          {`Borrowed from ${ownerName} ${deadline}`}
        </div>
      </div>
    );
  };

  if (!session) {
    return (
      <p className={styles.emptyContainer}>Log in to add books to the Market</p>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.listContainer}>
        {myBooks ? (
          <BookListPanel<MarketBook>
            title="My Market Offers"
            books={myBooks}
            getData={(item) => ({
              ...item.book.volumeInfo,
              id: item.book._id ?? "",
              imageSrc:
                item.book.volumeInfo.imageLinks?.smallThumbnail ??
                item.book.volumeInfo.imageLinks?.thumbnail ??
                null,
            })}
            renderLabel={(i: MarketBook) => renderStatusLabel(i)}
            renderFooter={(i: MarketBook) => renderOfferTypeFooter(i)}
          />
        ) : null}
        {borrowedBooks ? (
          <BookListPanel<MarketBook>
            title="Borrowed Books"
            books={borrowedBooks}
            getData={(item) => ({
              ...item.book.volumeInfo,
              id: item.book._id ?? "",
              imageSrc:
                item.book.volumeInfo.imageLinks?.smallThumbnail ??
                item.book.volumeInfo.imageLinks?.thumbnail ??
                null,
            })}
            renderLabel={(i: MarketBook) => renderProgressLabel(i)}
            renderFooter={(i: MarketBook) => renderMessageOwnerFooter(i)}
          />
        ) : null}
        {borrowedFromMeBooks ? (
          <BookListPanel<MarketBook>
            title="Books borowed from Me"
            books={borrowedFromMeBooks}
            getData={(item) => ({
              ...item.book.volumeInfo,
              id: item.book._id ?? "",
              imageSrc:
                item.book.volumeInfo.imageLinks?.smallThumbnail ??
                item.book.volumeInfo.imageLinks?.thumbnail ??
                null,
            })}
          />
        ) : null}
      </div>
    </div>
  );
}
