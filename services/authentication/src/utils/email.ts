const emailRegex = new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$');

export const validateEmail = (email: string): boolean => {
  return emailRegex.test(email);
};
