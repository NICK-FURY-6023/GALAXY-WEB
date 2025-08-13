/**
 * Authentication utilities for VEYNOVA Music Player
 * Handles JWT tokens and session management
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = '7d';

/**
 * Generate JWT token for user session
 * @param {Object} payload - User data to encode in token
 * @returns {string} JWT token
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded payload or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return null;
  }
}

/**
 * Extract user from request cookies
 * @param {Object} req - Next.js request object
 * @returns {Object|null} User data or null
 */
export function getUserFromRequest(req) {
  const token = req.cookies?.vyn_sess;
  if (!token) return null;
  
  return verifyToken(token);
}

/**
 * Create cookie options for JWT
 * @param {boolean} isProduction - Whether in production environment
 * @returns {Object} Cookie options
 */
export function getCookieOptions(isProduction = process.env.NODE_ENV === 'production') {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };
}