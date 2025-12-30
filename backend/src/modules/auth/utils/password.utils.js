const argon2 = require('argon2');

/**
 * Hash password using argon2
 * @param {String} password - Plain text password
 * @returns {Promise<String>} Hashed password
 */
const hashPassword = async (password) => {
  try {
    return await argon2.hash(password);
  } catch (err) {
    throw new Error('Password hashing failed');
  }
};

/**
 * Compare password with hash
 * @param {String} password - Plain text password
 * @param {String} hash - Hashed password
 * @returns {Promise<Boolean>} True if password matches
 */
const comparePassword = async (password, hash) => {
  try {
    return await argon2.verify(hash, password);
  } catch (err) {
    return false;
  }
};

/**
 * Validate password strength
 * @param {String} password - Password to validate
 * @returns {Object} { valid: Boolean, errors: Array }
 */
const validatePasswordStrength = (password) => {
  const errors = [];
  const minLength = parseInt(process.env.PASSWORD_MIN_LENGTH) || 8;

  if (!password || password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

module.exports = {
  hashPassword,
  comparePassword,
  validatePasswordStrength,
};
