import React from "react";
import styles from "./Label.module.css";

interface LabelProps {
  label?: string;
}

function Label({ label }: LabelProps) {
  return (
    <div className={styles.container}>
      {label ? label?.charAt(0).toUpperCase() + label?.slice(1) : null}
    </div>
  );
}

export default Label;
