import React from "react";
import styles from "./Button.module.css";

export enum ButtonType {
  PRIMARY,
  SECONDARY,
}

interface CustomButtonProps {
  children: React.ReactNode;
  ariaLabel: string;
  type: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  buttonType?: ButtonType;
  customStyles?: React.CSSProperties;
}

export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  customStyles,
  buttonType,
  ariaLabel,
}: CustomButtonProps) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={`${
        buttonType === ButtonType.PRIMARY ? styles.primary : styles.secondary
      } ${styles.button}`}
      style={customStyles}
    >
      {children}
    </button>
  );
}
