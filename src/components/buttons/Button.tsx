import React from "react";
import styles from "./Button.module.css";

export enum ButtonType {
  PRIMARY,
  SECONDARY,
}

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
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
}: CustomButtonProps) {
  return (
    <button
      type={type}
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
