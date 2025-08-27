import React, { forwardRef, SelectHTMLAttributes } from "react";
import styles from "./Select.module.css";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string | number; label: string }[];
  customStyles?: React.CSSProperties;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, customStyles, ...props }, ref) => (
    <div className={styles.container} style={customStyles}>
      <label htmlFor={label} className={styles.label}>
        {label}
      </label>
      <select
        id={label}
        ref={ref}
        {...props}
        className={styles.select}
        style={customStyles}
      >
        <option value="" className={styles.option}>
          Select an option
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <div>{error}</div>}
    </div>
  )
);

Select.displayName = "Select";
export default Select;
