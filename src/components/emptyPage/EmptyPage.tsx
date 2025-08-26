import React from "react";
import { Pacifico } from "next/font/google";
import styles from "./EmptyPage.module.css";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
});

function EmptyPage() {
  return (
    <p className={`${pacifico.className} ${styles.formTitle}`}>
      Oops! This chapter is still being written...
    </p>
  );
}

export default EmptyPage;
