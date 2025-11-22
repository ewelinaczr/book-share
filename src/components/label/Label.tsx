import React from "react";
import styles from "./Label.module.css";
import { useTranslations } from "next-intl";

interface LabelProps {
  label?: string;
}

function Label({ label }: LabelProps) {
  const t = useTranslations();
  return (
    <div className={styles.container}>
      {label ? t(`market_${label.toLowerCase()}`) : null}
    </div>
  );
}

export default Label;
