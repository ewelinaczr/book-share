import AddToBookshelf from "./addToBookshelfPanel/AddToBookshelf";
import Bookshelf from "./bookshelfPanel/Bookshelf";
import BookshelfStats from "./stats/BookshelfStats";

export default function BookshelfPage() {
  return (
    <div>
      <BookshelfStats />
      {/* <AddToBookshelf /> */}
      <Bookshelf />
    </div>
  );
}
