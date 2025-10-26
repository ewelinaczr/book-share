"use client";

import React, { useEffect, useState } from "react";
import { IoMoonOutline } from "react-icons/io5";
import { GoSun } from "react-icons/go";
import { useTranslations } from "next-intl";
import { getTheme, setTheme } from "@/app/actions/setTheme";
import styles from "./ThemeButton.module.css";

function ThemeButton() {
  const t = useTranslations();
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  useEffect(() => {
    const fetchTheme = async () => {
      const current = await getTheme();
      setThemeState(current === "dark" ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", current); // optional: apply theme
    };
    fetchTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    await setTheme(newTheme);
    setThemeState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme); // optional: apply theme
  };

  return (
    <div className={styles.toogleContainer}>
      <div className={styles.icon}>
        <GoSun />
      </div>
      <div className={styles.icon}>
        <IoMoonOutline />
      </div>
      <button
        aria-label={t("buttons_toggleTheme")}
        className={`${styles.toogle} ${
          theme === "dark" ? styles.selected : ""
        }`}
        onClick={toggleTheme}
      ></button>
    </div>
  );
}

export default ThemeButton;
