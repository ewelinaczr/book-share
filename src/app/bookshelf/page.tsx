import AddToBookshelf from "./addToBookshelfPanel/AddToBookshelf";
import Bookshelf from "./bookshelfPanel/Bookshelf";
import BookshelfStats from "./stats/BookshelfStats";

export default function BookshelfPage() {
  return (
    <main>
      <AddToBookshelf />
      <BookshelfStats />
      <Bookshelf />
    </main>
  );
}
