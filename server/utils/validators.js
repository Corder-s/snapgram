// Input validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username) => {
  // Username: 3-30 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
};

export const validatePassword = (password) => {
  // Password: at least 6 characters
  return password && password.length >= 6;
};

export const validateBio = (bio) => {
  // Bio: max 150 characters
  return !bio || (typeof bio === 'string' && bio.length <= 150);
};

export const validateFullName = (name) => {
  // Full name: 2-50 characters
  return name && typeof name === 'string' && name.length >= 2 && name.length <= 50;
};

export const validatePostCaption = (caption) => {
  // Caption: max 500 characters
  return !caption || (typeof caption === 'string' && caption.length <= 500);
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  // Remove potential XSS attacks
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};

export const sanitizeUserData = (user) => {
  return {
    ...user,
    fullName: sanitizeInput(user.fullName),
    bio: sanitizeInput(user.bio),
  };
};

export const sanitizePostData = (post) => {
  return {
    ...post,
    caption: sanitizeInput(post.caption),
  };
};

export default {
  validateEmail,
  validateUsername,
  validatePassword,
  validateBio,
  validateFullName,
  validatePostCaption,
  sanitizeInput,
  sanitizeUserData,
  sanitizePostData,
};
