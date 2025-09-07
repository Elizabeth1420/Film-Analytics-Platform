function parseIntWithFallback(v, fallback) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fallback : n;
}  

function isValidPositiveInteger(id) {
  const n = Number(id);
  return Number.isInteger(n) && n > 0;
}

function validatePageNumber(page) {
  const DEFAULT_PAGE = 1;

  if(!isValidPositiveInteger(page)) {
    return DEFAULT_PAGE;
  }
  return page;
}

function isValidPassword(password) {
  // Supabase required passwords to be 6 or more characters
  return typeof password === 'string' && password.length >= 6;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Checks if a movie title is a non-empty string between 2 and 100 characters
function isValidTitle(title) {
  return (
    typeof title === 'string' &&
    title.trim().length >= 2 &&
    title.trim().length <= 100
  );
}

// Checks if a year is a valid integer between 1880 and next year
function isValidYear(year) {
  const MIN_YEAR = 1880;
  const n = Number(year);
  return Number.isInteger(n) && n >= MIN_YEAR;
}

function validateMovieBody(body) {
  if (!body.title || typeof body.title !== 'string') return 'Invalid or missing title';
  if (!body.release_date || isNaN(Date.parse(body.release_date))) return 'Invalid or missing release_date';
  if (!body.director || typeof body.director !== 'string') return 'Invalid or missing director';
  if (!body.genre || typeof body.genre !== 'string') return 'Invalid or missing genre';
  if (typeof body.runtime !== 'number' || body.runtime <= 0) return 'Invalid or missing runtime';
  if (typeof body.box_office !== 'number' || body.box_office < 0) return 'Invalid or missing box_office';
  if (typeof body.budget !== 'number' || body.budget < 0) return 'Invalid or missing budget';
  if (typeof body.award_wins !== 'number' || body.award_wins < 0) return 'Invalid or missing award_wins';
  if (typeof body.award_nominations !== 'number' || body.award_nominations < 0) return 'Invalid or missing award_nominations';
  return null; // No errors
}

module.exports = { parseIntWithFallback, isValidEmail, isValidPassword, validateMovieBody, isValidPositiveInteger, isValidTitle, isValidYear, validatePageNumber };