import AddToBookshelf from "./AddToBookshelf";
import Bookshelf from "./Bookshelf";
import styles from "./pageStyles.module.css";

export default function BookshelfPage() {
  return (
    <div className={styles.container}>
      <AddToBookshelf />
      <Bookshelf />
    </div>
  );
}
