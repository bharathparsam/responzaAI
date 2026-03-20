const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Import and use routes
const emergencyRoutes = require('./routes/emergency');
app.use('/api/emergency', emergencyRoutes);

app.listen(PORT, () => {
  console.log(`Responza AI Server running on port ${PORT}`);
});
