import AddToBookshelf from "./addToBookshelfPanel/AddToBookshelf";
import Bookshelf from "./bookshelfPanel/Bookshelf";
import styles from "./pageStyles.module.css";

export default function BookshelfPage() {
  return (
    <div className={styles.container}>
      <AddToBookshelf />
      <Bookshelf />
    </div>
  );
}
