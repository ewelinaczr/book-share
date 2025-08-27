import React from "react";
import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  withoutError?: boolean;
  icon?: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  customStyles?: React.CSSProperties;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      withoutError = false,
      icon,
      id,
      className,
      customStyles,
      ...props
    },
    ref
  ) => (
    <div className={styles.container}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputContainer}>
        {icon && React.cloneElement(icon, { className: styles.icon })}
        <input
          id={id}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={styles.input}
          {...props}
          style={icon ? { paddingLeft: "36px", ...customStyles } : customStyles}
        />
      </div>
      {withoutError ? null : (
        <span id={`${id}-error`} className={styles.error}>
          {error}
        </span>
      )}
    </div>
  )
);

Input.displayName = "Input";
export default Input;
