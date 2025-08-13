/**
 * Radio stations endpoint
 */

import { getRadioStations } from '../../../lib/sources/radio.js';
import { handleApiError } from '../../../lib/errors.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stations = await getRadioStations();
    
    res.status(200).json({
      stations,
      total: stations.length
    });

  } catch (error) {
    return handleApiError(error, res);
  }
}