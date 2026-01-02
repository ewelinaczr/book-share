"use client";

import { useState } from "react";
import { BookshelfBook, BookStatus } from "@/interfaces/BookshelfBook";
import { useGetBookshelfQuery } from "@/api/bookshelfApi";
import { useTranslations } from "next-intl";
import { useDeleteButton } from "@/app/home/userOffersPanel/useDeleteButton";
import { useEditButton } from "@/app/home/userOffersPanel/useEditButton";
import { RatingFooter } from "./RatingFooter";
import { useSession } from "next-auth/react";
import styles from "./Bookshelf.module.css";

import BookListPanel from "@/components/bookListPanel/BookListPanel";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import EditPopup from "./EditPopup";
import LogInRedirect from "@/components/loginRedirect/LogInRedirect";
import Header from "@/components/headers/Header";

const getBookData = (item: BookshelfBook) => {
  const { volumeInfo } = item.book;
  return {
    ...volumeInfo,
    id: item.book._id ?? "",
    imageSrc:
      volumeInfo.imageLinks?.smallThumbnail ??
      volumeInfo.imageLinks?.thumbnail ??
      null,
  };
};

export default function Bookshelf() {
  const reading = useGetBookshelfQuery({ status: BookStatus.READING });
  const wantToRead = useGetBookshelfQuery({ status: BookStatus.WANT_TO_READ });
  const read = useGetBookshelfQuery({ status: BookStatus.READ });
  const [itemToEdit, setItemToEdit] = useState<string | null>(null);
  const { renderEditButton } = useEditButton<BookshelfBook>(setItemToEdit);
  const { renderDeleteButton } = useDeleteButton();
  const t = useTranslations();
  const { data: session } = useSession();
  const currentUserId = session?.user.id;

  const isLoading = reading.isLoading || wantToRead.isLoading || read.isLoading;
  const isError = reading.isError || wantToRead.isError || read.isError;

  if (!currentUserId) {
    return (
      <section className={styles.errorContainer}>
        <Header label={t("bookshelf_addBookTitle")} />
        <LogInRedirect />
      </section>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!reading.data?.length && !wantToRead.data?.length && !read.data?.length) {
    return null;
  }

  if (isError) {
    return (
      <section className={styles.errorContainer}>
        <div>{t("bookshelf_error")}</div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <ul className={styles.listContainer} id="nextstep-step11">
        {Array.isArray(reading.data) && reading.data.length > 0 && (
          <li>
            <BookListPanel<BookshelfBook>
              title="Currently reading"
              books={reading.data}
              getData={getBookData}
              renderEditButton={renderEditButton}
              renderDeleteButton={renderDeleteButton}
            />
          </li>
        )}
        {Array.isArray(wantToRead.data) && wantToRead.data.length > 0 && (
          <li>
            <BookListPanel<BookshelfBook>
              title="Want to read"
              books={wantToRead.data}
              getData={getBookData}
              renderEditButton={renderEditButton}
              renderDeleteButton={renderDeleteButton}
            />
          </li>
        )}
        {Array.isArray(read.data) && read.data.length > 0 && (
          <li>
            <BookListPanel<BookshelfBook>
              title="Read"
              books={read.data}
              getData={getBookData}
              renderFooter={(selectedItem) => (
                <RatingFooter selectedItem={selectedItem} />
              )}
              renderEditButton={renderEditButton}
              renderDeleteButton={renderDeleteButton}
            />
          </li>
        )}
      </ul>
      {itemToEdit ? (
        <EditPopup bookId={itemToEdit} onClose={() => setItemToEdit(null)} />
      ) : null}
    </section>
  );
}
