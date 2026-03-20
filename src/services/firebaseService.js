const admin = require('firebase-admin');
require('dotenv').config();

const localServiceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
  '/Users/bharathparsam/Downloads/bharath-prompt-wars-firebase-adminsdk-fbsvc-8272b572e4.json';

const fs = require('fs');

try {
  if (fs.existsSync(localServiceAccountPath)) {
    const serviceAccount = require(localServiceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Initialized Successfully (via JSON file)');
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    console.log('Firebase Initialized Successfully (via ADC)');
  }
} catch (error) {
  console.error('❌ Firebase Initialization Error:', error.message);
  console.warn('⚠️  Continuing without database...');
}

let db = null;
if (admin.apps.length > 0) {
  db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
}


async function saveIncident(incidentData) {
  try {
    if (!db) {
      console.log('No Firebase DB. Logging incident to console:', JSON.stringify(incidentData, null, 2));
      return { id: 'local_' + Date.now() };
    }

    const docRef = await db.collection('incidents').add({
      ...incidentData,
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('Incident saved with ID:', docRef.id);
    return { id: docRef.id };
  } catch (error) {
    console.error('Firebase Save Incident Error:', error);
    throw error;
  }
}

async function getIncidents() {
  try {
    if (!db) return [];
    
    const snapshot = await db.collection('incidents')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();
      
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Firebase Get Incidents Error:', error);
    return [];
  }
}

module.exports = { saveIncident, getIncidents };
