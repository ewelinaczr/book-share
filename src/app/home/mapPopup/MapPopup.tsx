import React from "react";
import styles from "./MapPopup.module.css";

export function MapPopup({ preview }) {
  return <div className={styles.container}>{preview?.label}</div>;
}
