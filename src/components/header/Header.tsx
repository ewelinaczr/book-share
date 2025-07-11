import React from "react";
import styles from "./Header.module.css";

interface HeaderProps {
  label: string;
}

function Header({ label }: HeaderProps) {
  return <p className={styles.title}>{label}</p>;
}

export default Header;
