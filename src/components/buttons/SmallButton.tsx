import React from "react";
import styles from "./SmallButton.module.css";

interface SmallButtonProps {
  ariaLabel: string;
  icon?: React.ReactNode;
  text: string;
  onClick: () => void;
  customStyles?: React.CSSProperties;
}

function SmallButton({
  onClick,
  text,
  icon,
  customStyles,
  ariaLabel,
}: SmallButtonProps) {
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

export default SmallButton;
