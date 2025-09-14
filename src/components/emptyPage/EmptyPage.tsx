import React from "react";
import { pacifico } from "@/app/fonts";
import styles from "./EmptyPage.module.css";

function EmptyPage() {
  return (
    <p className={`${pacifico.className} ${styles.formTitle}`}>
      Oops! This chapter is still being written...
    </p>
  );
}

export default EmptyPage;
