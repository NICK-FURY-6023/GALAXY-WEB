/**
 * Logout Endpoint
 */

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Clear the session cookie
  res.setHeader('Set-Cookie', [
    `galaxy_sess=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
  ]);

  res.status(200).json({ success: true, message: 'Logged out successfully' });
}