/**
 * Rate limiting utilities for VEYNOVA Music Player
 * Token bucket implementation
 */

import { RateLimitError } from './errors.js';

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map();

/**
 * Token bucket rate limiter
 * @param {string} key - Unique identifier for the rate limit (IP, user ID, etc.)
 * @param {Object} options - Rate limit options
 * @param {number} options.maxTokens - Maximum number of tokens in bucket
 * @param {number} options.refillRate - Rate at which tokens are added (tokens per second)
 * @param {number} options.tokensToConsume - Number of tokens to consume for this request
 * @returns {boolean} True if request is allowed, throws RateLimitError if not
 */
export function rateLimit(key, options = {}) {
  const {
    maxTokens = 60,
    refillRate = 1, // 1 token per second
    tokensToConsume = 1,
  } = options;

  const now = Date.now();
  
  // Get or create bucket
  let bucket = rateLimitStore.get(key);
  if (!bucket) {
    bucket = {
      tokens: maxTokens,
      lastRefill: now,
    };
    rateLimitStore.set(key, bucket);
  }

  // Calculate tokens to add based on time elapsed
  const timePassed = (now - bucket.lastRefill) / 1000; // seconds
  const tokensToAdd = Math.floor(timePassed * refillRate);
  
  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(maxTokens, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }

  // Check if request can be fulfilled
  if (bucket.tokens >= tokensToConsume) {
    bucket.tokens -= tokensToConsume;
    return true;
  }

  throw new RateLimitError(`Rate limit exceeded. Try again in ${Math.ceil((tokensToConsume - bucket.tokens) / refillRate)} seconds.`);
}

/**
 * Express/Next.js middleware for rate limiting
 * @param {Object} options - Rate limit options
 */
export function rateLimitMiddleware(options = {}) {
  return (req, res, next) => {
    try {
      // Use IP as default key, can be enhanced with user ID
      const key = req.ip || req.connection.remoteAddress || 'unknown';
      rateLimit(key, options);
      
      if (next) next();
      return true;
    } catch (error) {
      if (error instanceof RateLimitError) {
        return res.status(429).json({
          error: {
            code: 'RATE_LIMIT_ERROR',
            message: error.message
          }
        });
      }
      throw error;
    }
  };
}

/**
 * Clear old entries from rate limit store (call periodically)
 */
export function cleanupRateLimit() {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  for (const [key, bucket] of rateLimitStore.entries()) {
    if (now - bucket.lastRefill > oneHour) {
      rateLimitStore.delete(key);
    }
  }
}

// Clean up every hour
setInterval(cleanupRateLimit, 60 * 60 * 1000);