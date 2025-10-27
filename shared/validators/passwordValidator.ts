export const validatePassword = (value: string): boolean => {
  const isValidLength = value.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);

  return isValidLength && hasLetter && hasNumber;
};
