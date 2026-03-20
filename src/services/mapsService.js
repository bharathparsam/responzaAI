const axios = require('axios');
require('dotenv').config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Finds nearby emergency services based on location and type.
 * @param {Object} location - { lat, lng }
 * @param {string} type - 'hospital' | 'fire_station' | 'police'
 */
async function findNearbyEmergencyServices(location, type) {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('Google Maps API Key missing. Returning mock data.');
      return getMockEmergencyServices(type);
    }

    const { lat, lng } = location;
    const radius = 5000; // 5km search radius

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      {
        params: {
          location: `${lat},${lng}`,
          radius,
          type,
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    return response.data.results.map((place) => ({
      name: place.name,
      address: place.vicinity,
      rating: place.rating,
      location: place.geometry.location,
      place_id: place.place_id,
    }));
  } catch (error) {
    console.error('Maps Service Error:', error);
    return [];
  }
}

function getMockEmergencyServices(type) {
  // Fallback mock data for development or missing API key
  const mocks = {
    hospital: [{ name: 'City Central Hospital', address: '123 Medical Ave' }],
    fire_station: [{ name: 'Harbor Fire Station', address: '456 Flame St' }],
    police: [{ name: 'Precinct 9', address: '789 Justice Blvd' }],
  };
  return mocks[type] || [];
}

module.exports = { findNearbyEmergencyServices };
