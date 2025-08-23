function parseIntWithFallback(v, fallback) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fallback : n;
}  

function isValidPassword(password) {
  // Supabase required passwords to be 6 or more characters
  return typeof password === 'string' && password.length >= 6;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = { parseIntWithFallback, isValidEmail, isValidPassword };