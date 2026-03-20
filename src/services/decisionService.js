const { analyzeEmergency } = require('./geminiService');
const { findNearbyEmergencyServices } = require('./mapsService');
const { saveIncident } = require('./firebaseService');

/**
 * Main logic to handle an emergency report.
 * @param {string} input - User message/input.
 * @param {Object} location - { lat, lng } if available.
 */
async function processEmergency(input, location = null) {
  try {
    // 1. Analyze with Gemini
    const analysis = await analyzeEmergency(input, { locationAvailable: !!location });

    // 2. Fetch nearby services based on category
    let nearbyServices = [];
    if (location && analysis.category !== 'Unknown') {
      let searchType = 'hospital'; // Default
      if (analysis.category === 'Fire') searchType = 'fire_station';
      if (analysis.category === 'Public Safety') searchType = 'police';
      if (analysis.category === 'Traffic') searchType = 'police';
      
      nearbyServices = await findNearbyEmergencyServices(location, searchType);
    }

    // 3. Create full report
    const fullReport = {
      ...analysis,
      nearbyServices,
      locationProvided: !!location,
      timestamp: new Date().toISOString()
    };

    // 4. Save to Firebase (Async, don't block response)
    saveIncident(fullReport).catch(err => console.error('Silent Firebase error:', err));

    return fullReport;
  } catch (error) {
    console.error('Process Emergency Logic Error:', error);
    // Return a safe fallback response
    return {
      severity: 'Critical',
      category: 'Unknown',
      intent: 'Unable to analyze input. Please get to safety immediately.',
      protocol: {
        immediate: ['Exit the area immediately', 'Call local emergency services (e.g., 911)'],
        next: ['Stay low and move toward an exit', 'Avoid using elevators'],
        if_trapped: ['Seal doors if possible', 'Signal for help from the window']
      },
      reasoning: 'Fallback response triggered due to processing failure.'
    };
  }
}

module.exports = { processEmergency };
