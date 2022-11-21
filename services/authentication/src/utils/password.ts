// Minimum 8 chars, at least one uppercase letter, one lowercase letter, one number and one special character:
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.!@#$%^&*()_+-=,:;?])(?=.{8,})/;

export const validatePassword = (password: string): boolean => {
  return passwordRegex.test(password);
};
