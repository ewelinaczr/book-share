import React from "react";
import Link from "next/link";
import cn from "classnames";
import { abrilFatface } from "@/app/fonts";
import { useTranslations } from "next-intl";
import styles from "./Navigation.module.css";

function AppName() {
  const t = useTranslations();

  return (
    <Link href={"/"} prefetch={false}>
      <span className={cn(abrilFatface.className, styles.title)}>
        {t("navigation_title")}
      </span>
    </Link>
  );
}

export default AppName;
