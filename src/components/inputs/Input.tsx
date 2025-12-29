import React from "react";
import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  withoutError?: boolean;
  icon?: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  secondaryIcon?: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  secondaryIconActive?: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  isSecondaryIconActive?: boolean;
  customStyles?: React.CSSProperties;
  handleIconPress?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      withoutError = false,
      icon,
      secondaryIcon,
      secondaryIconActive,
      isSecondaryIconActive,
      id,
      className,
      customStyles,
      handleIconPress,
      ...props
    },
    ref
  ) => {
    const onToggleSecondaryIcon = () => {
      if (handleIconPress) {
        handleIconPress((prev) => !prev);
      }
    };

    const iconToRender =
      isSecondaryIconActive && secondaryIconActive
        ? secondaryIconActive
        : secondaryIcon;

    return (
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
            style={
              icon ? { paddingLeft: "36px", ...customStyles } : customStyles
            }
          />
          {iconToRender &&
            React.cloneElement(iconToRender, {
              className: styles.secondaryIcon,
              onClick: onToggleSecondaryIcon,
            })}
        </div>
        {withoutError ? null : (
          <span id={`${id}-error`} className={styles.error}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
