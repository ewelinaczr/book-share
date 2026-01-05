import React from "react";
import styles from "./ButtonPlain.module.css";

interface PlainButtonProps {
  ariaLabel: string;
  icon?: React.ReactNode;
  text: string;
  onClick: () => void;
  customStyles?: React.CSSProperties;
}

function ButtonPlain({
  onClick,
  text,
  icon,
  customStyles,
  ariaLabel,
}: PlainButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      style={customStyles}
      className={styles.button}
    >
      <div className={styles.icon}>{icon}</div>
      <h4>{text}</h4>
    </button>
  );
}

export default ButtonPlain;
