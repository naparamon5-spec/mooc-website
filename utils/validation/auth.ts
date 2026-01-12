export const validateName = (name: string): string => {
  if (!name.trim()) {
    return 'Full name is required';
  }
  return '';
};

export const validateEmail = (email: string): string => {
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return 'Enter a valid email address';
  }
  return '';
};

export const validatePassword = (password: string): string => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return '';
};
