import React from "react";
import styles from "./Input.module.css";
import { CiSearch } from "react-icons/ci";
import { IconType } from "react-icons";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, id, className, ...props }, ref) => (
    <div className={styles.container}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      {icon && React.cloneElement(icon, { className: styles.icon })}
      <input
        id={id}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={styles.input}
        {...props}
        style={icon ? { paddingLeft: "36px" } : {}}
      />
      {error && <span id={`${id}-error`}>{error}</span>}
    </div>
  )
);

Input.displayName = "Input";
export default Input;
