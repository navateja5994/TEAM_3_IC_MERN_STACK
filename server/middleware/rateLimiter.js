const rateLimitMap = new Map();

/**
 * In-memory rate limiter for user lookups by phone number to mitigate scanning.
 * Limits IP addresses to a max of 10 checks per minute.
 */
const phoneLookupRateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 10;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const timestamps = rateLimitMap.get(ip);
  
  // Keep only timestamps within the current window
  const validTimestamps = timestamps.filter(timestamp => now - timestamp < windowMs);
  
  if (validTimestamps.length >= maxRequests) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Too many phone lookups. Please try again later.'
    });
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  next();
};

module.exports = {
  phoneLookupRateLimiter
};
