import React from "react";
import styles from "./SmallLabel.module.css";

interface LabelProps {
  label?: string;
}

function SmallLabel({ label }: LabelProps) {
  return <div className={styles.container}>{label}</div>;
}

export default SmallLabel;
