export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateRequired = (value: string): boolean => {
  return value.trim() !== '';
};

export const validateDateOfBirth = (dob: string): boolean => {
  const date = new Date(dob);
  const now = new Date();
  return date < now;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): Promise<void> => {
  if (!confirmPassword || password === confirmPassword) {
    return Promise.resolve();
  }
  return Promise.reject('Passwords do not match');
};