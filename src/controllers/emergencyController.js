const { processEmergency } = require('../services/decisionService');
const { getIncidents } = require('../services/firebaseService');

async function reportEmergency(req, res) {
  try {
    const { input, location } = req.body;
    
    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }

    const report = await processEmergency(input, location);
    res.json(report);
  } catch (error) {
    console.error('Controller Report Emergency Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function fetchIncidents(req, res) {
  try {
    const incidents = await getIncidents();
    res.json(incidents);
  } catch (error) {
    console.error('Controller Fetch Incidents Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { reportEmergency, fetchIncidents };
