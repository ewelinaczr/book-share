"use client";

import List from "@/components/list/List";
import AddToBookshelf from "@/components/bookshelf/AddToBookshelf";
import { BookStatus } from "@/interfaces/BookshelfBook";
import { useGetBookshelfQuery } from "@/api/bookshelfApi";

function useBookshelfByStatus(status: BookStatus) {
  const { data, isLoading, isError, error } = useGetBookshelfQuery({ status });
  return { data, isLoading, isError, error };
}

const bookshelfCategories = [
  { status: BookStatus.READING, title: "Currently Reading" },
  { status: BookStatus.WANT_TO_READ, title: "Want to Read" },
  { status: BookStatus.READ, title: "Read" },
];

export default function BookshelfClient() {
  const bookshelfData = bookshelfCategories.map(({ status }) =>
    useBookshelfByStatus(status)
  );

  const isLoading = bookshelfData.some((cat) => cat.isLoading);
  const isError = bookshelfData.some((cat) => cat.isError);
  const errorDetails = bookshelfData.find((cat) => cat.isError);

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div>
        Error loading bookshelf.
        <br />
        {JSON.stringify(errorDetails?.error)}
      </div>
    );

  return (
    <>
      <h1>My Virtual Bookshelf</h1>
      <AddToBookshelf />
      {bookshelfCategories.map(({ title }, idx) => (
        <List
          key={title}
          title={title}
          items={
            bookshelfData[idx].data
              ? bookshelfData[idx].data.map((b) => b.book)
              : []
          }
        />
      ))}
      <List title="Recommendations" items={[]} />
    </>
  );
}
