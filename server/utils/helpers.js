/**
 * Normalizes phone numbers to standard E.164 format (e.g. +919876543210).
 * Defaults to +91 country prefix for 10-digit Indian numbers.
 */
function normalizePhoneNumber(phone) {
  if (!phone) return '';
  
  // Strip spaces, dashes, parentheses
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  // If 10 digits, prepend default Indian country code (+91)
  if (cleaned.length === 10 && /^\d+$/.test(cleaned)) {
    return '+91' + cleaned;
  }
  
  // Prepend '+' to digits only
  if (/^\d+$/.test(cleaned)) {
    return '+' + cleaned;
  }
  
  return cleaned;
}

module.exports = {
  normalizePhoneNumber
};
