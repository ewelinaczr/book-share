import React from "react";
import { pacifico } from "@/app/fonts";
import styles from "./EmptyPage.module.css";

function EmptyPage() {
  return (
    <h2 className={`${pacifico.className} ${styles.formTitle}`}>
      Oops! This chapter is still being written...
    </h2>
  );
}

export default EmptyPage;
