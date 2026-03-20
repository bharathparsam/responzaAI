const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');

router.post('/report', emergencyController.reportEmergency);
router.get('/incidents', emergencyController.fetchIncidents);

module.exports = router;
