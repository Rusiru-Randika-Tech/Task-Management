// Ensures a string is within required length bounds
export function requireNonEmpty(value: string, field: string, min = 1, max = 100): void {
  if (!value || value.trim().length < min) {
    throw new Error(`${field} must be at least ${min} character(s)`);
  }
  if (value.trim().length > max) {
    throw new Error(`${field} must be at most ${max} characters`);
  }
}

// Validates email against a basic RFC-like pattern
export function validateEmail(email: string): void {
  const re = /^[\w.!#$%&'*+/=?`{|}~-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!re.test(email)) {
    throw new Error('Invalid email format');
  }
}

// Verifies password complexity requirements
export function validatePassword(password: string): void {
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain an uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    throw new Error('Password must contain a lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    throw new Error('Password must contain a digit');
  }
}

export function validateDate(dateStr: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error('Date must be in YYYY-MM-DD format');
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date value');
  }
}
