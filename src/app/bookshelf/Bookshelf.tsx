"use client";

import List from "@/components/list/List";
import { BookStatus } from "@/interfaces/BookshelfBook";
import { useGetBookshelfQuery } from "@/api/bookshelfApi";

function useBookshelfByStatus(status: BookStatus) {
  const { data, isLoading, isError, error } = useGetBookshelfQuery({ status });
  return { data, isLoading, isError, error };
}

export default function Bookshelf() {
  const reading = useBookshelfByStatus(BookStatus.READING);
  const wantToRead = useBookshelfByStatus(BookStatus.WANT_TO_READ);
  const read = useBookshelfByStatus(BookStatus.READ);

  const bookshelfData = [
    { title: "Currently Reading", ...reading },
    { title: "Want to Read", ...wantToRead },
    { title: "Read", ...read },
  ];

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
      {bookshelfData.map(({ title, data }, idx) => (
        <List
          key={title}
          title={title}
          items={data ? data.map((b: any) => b.book) : []}
        />
      ))}
      <List title="Recommendations" items={[]} />
    </>
  );
}
