import React from "react";
import styles from "./MainHeader.module.css";

interface MainHeaderProps {
  label: string;
}

function MainHeader({ label }: MainHeaderProps) {
  return <p className={styles.title}>{label}</p>;
}

export default MainHeader;
