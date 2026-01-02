"use client";

import React, { forwardRef } from "react";

import styles from "./Select.module.css";
import Dropdown, { DropdownOption } from "../dropdown/Dropdown";

interface SelectProps {
  label?: string;
  error?: string;
  options: DropdownOption[];
  customStyles?: React.CSSProperties;
  value: string;
  onChange: (value: string) => void;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ label, error, options, customStyles, value, onChange }, ref) => {
    return (
      <div className={styles.container} style={customStyles} ref={ref}>
        {label && <label className={styles.label}>{label}</label>}

        <Dropdown
          value={value}
          options={options}
          onChange={onChange}
          ariaLabel={label}
        />

        {error && <div className={styles.error}>{error}</div>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
