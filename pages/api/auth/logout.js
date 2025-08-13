/**
 * Logout endpoint
 */

import { getCookieOptions } from '../../../lib/auth.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Clear the authentication cookie
  const cookieOptions = getCookieOptions();
  res.setHeader('Set-Cookie', [
    `vyn_sess=; ${Object.entries({
      ...cookieOptions,
      maxAge: 0,
      expires: new Date(0),
    })
      .map(([key, value]) => `${key}=${value}`)
      .join('; ')}`
  ]);

  res.status(200).json({ message: 'Logged out successfully' });
}