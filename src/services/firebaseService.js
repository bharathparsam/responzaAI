const admin = require('firebase-admin');
require('dotenv').config();

// Option 1: Provide the path directly to the JSON file you downloaded
const defaultPath = '/Users/bharathparsam/Downloads/bharath-prompt-wars-firebase-adminsdk-fbsvc-8272b572e4.json';
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || defaultPath;

// Option 2: Individual variables
const firestoreConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')?.replace(/"/g, ''),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

try {
  if (serviceAccountPath) {
    console.log('Using serviceAccountPath:', serviceAccountPath);
    const serviceAccount = require(serviceAccountPath);
    console.log('serviceAccount type:', typeof serviceAccount);
    console.log('serviceAccount keys:', Object.keys(serviceAccount));
    console.log('private_key starts with:', serviceAccount.private_key ? serviceAccount.private_key.substring(0, 30) : 'undefined');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath)
    });

    console.log('Firebase Initialized Successfully (via JSON file)');
  } else if (firestoreConfig.projectId && firestoreConfig.privateKey && firestoreConfig.clientEmail) {
    admin.initializeApp({
      credential: admin.credential.cert(firestoreConfig),
    });
    console.log('Firebase Initialized Successfully (via env vars)');
  } else {
    console.warn('Firebase configuration incomplete. Running in no-database mode.');
  }
} catch (error) {
  console.error('\\n❌ Firebase Initialization Error:', error.message);
  console.warn('⚠️  Continuing without database...\\n');
}

const db = admin.apps.length > 0 ? admin.firestore() : null;

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
