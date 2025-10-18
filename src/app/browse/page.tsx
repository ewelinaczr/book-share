import EmptyPage from "@/components/emptyPage/EmptyPage";
import styles from "./Browse.module.css";

export default async function Browse() {
  return (
    <main className={styles.container}>
      <EmptyPage />
    </main>
  );
}
