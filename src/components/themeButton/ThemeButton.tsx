import React from "react";
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { IoMoonOutline } from "react-icons/io5";
import { GoSun } from "react-icons/go";
import styles from "./ThemeButton.module.css";

interface ThemeButtonProps {
  theme: string;
  toggleTheme: () => void;
}

function ThemeButton({ theme, toggleTheme }: ThemeButtonProps) {
  return (
    <div className={styles.toogleContainer}>
      <div className={styles.icon}>
        <GoSun />
      </div>
      <div className={styles.icon}>
        <IoMoonOutline />
      </div>
      <button
        aria-label="Toggle Theme"
        className={`${styles.toogle} ${theme === "dark" && styles.selected}`}
        onClick={toggleTheme}
      ></button>
    </div>
  );
}

export default ThemeButton;
