function parseIntWithFallback(v, fallback) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fallback : n;
}  

module.exports = parseIntWithFallback