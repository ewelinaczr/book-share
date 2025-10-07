import React from "react";
import styles from "./Header.module.css";

interface HeaderProps {
  label: string;
}

function Header({ label }: HeaderProps) {
  return <h2 className={styles.title}>{label}</h2>;
}

export default Header;
