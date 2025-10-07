"use client";
import { useSession } from "next-auth/react";
import AddToBookshelf from "./addToBookshelfPanel/AddToBookshelf";
import Bookshelf from "./bookshelfPanel/Bookshelf";
import BookshelfStats from "./stats/BookshelfStats";
import styles from "./pageStyles.module.css";

export default function BookshelfPage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <p className={styles.emptyContainer}>Log in to add books to Bookshelf</p>
    );
  }
  return (
    <main>
      <AddToBookshelf />
      <BookshelfStats />
      <Bookshelf />
    </main>
  );
}
