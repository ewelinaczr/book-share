import React from "react";
import styles from "./TextArea.module.css";

interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}

export default function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: TextAreaProps) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`${styles.textarea}`}
    />
  );
}
