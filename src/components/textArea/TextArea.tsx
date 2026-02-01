import React from "react";
import styles from "./TextArea.module.css";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  rows?: number;
}

export default function TextArea({
  value,
  onChange,

  rows = 4,
  ...rest
}: TextAreaProps) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      rows={rows}
      className={styles.textarea}
      {...rest}
    />
  );
}
