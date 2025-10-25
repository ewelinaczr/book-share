"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getLocale, setLocale } from "../actions/setLocale"; // both are server functions
import Header from "@/components/headers/Header";
import styles from "./Settings.module.css";

export default function Settings() {
  const t = useTranslations();
  const [selectedLocale, setSelectedLocale] = useState("en"); // default fallback

  useEffect(() => {
    const fetchLocale = async () => {
      const locale = await getLocale(); // call server action
      setSelectedLocale(locale);
    };
    fetchLocale();
  }, []);

  const handleChange = async (locale: string) => {
    await setLocale(locale); // call server action
    setSelectedLocale(locale);
    window.location.reload(); // reload to apply new locale
  };

  return (
    <main className={styles.container}>
      <Header label={t("settings_language")} />
      <select
        aria-label="Select language"
        value={selectedLocale}
        className={styles.select}
        onChange={(e) => handleChange(e.target.value)}
      >
        <option value="en">{t("settings_en")}</option>
        <option value="pl">{t("settings_pl")}</option>
      </select>
    </main>
  );
}
