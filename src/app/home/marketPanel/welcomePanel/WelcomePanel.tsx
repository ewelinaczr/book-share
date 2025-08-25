import React from "react";
import { Pacifico } from "next/font/google";
import styles from "./WelcomePanel.module.css";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
});

function WelcomePanel() {
  return (
    <div className={styles.welcomeContainer}>
      <span className={`${pacifico.className} ${styles.welcome}`}>
        Welcome to Book Market!
      </span>
      <p className={styles.welcomeStepContainer}>
        <span className={styles.welcomeStep}>1</span>Find a Book in your
        neighborhood
      </p>
      <p className={styles.welcomeStepContainer}>
        <span className={styles.welcomeStep}>2</span>Decide wether you want to
        borrow or exchange the Book
      </p>
      <p className={styles.welcomeStepContainer}>
        <span className={styles.welcomeStep}>3</span>Contact the owner to
        arrange the exchange details
      </p>
      <p className={styles.welcomeStepContainer}>
        <span className={styles.welcomeStep}>4</span>Reserve the Book and wait
        for the owner to accept your request
      </p>
      <p className={styles.welcomeStepContainer}>
        <span className={styles.welcomeStep}>5</span>Pickup the Book at the
        agreed pickup spot
      </p>
    </div>
  );
}

export default WelcomePanel;
