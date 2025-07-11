import validator from "validator";

export const validateEmail = (value: string): boolean =>
  validator.isEmail(value);
