// routes/index.js

const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');

// Connect to MongoDB (using the connection string in Render env var)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schema for logs
const logSchema = new mongoose.Schema({
  participant_id: String,
  data: mongoose.Schema.Types.Mixed, // flexible JSON
  version: String,
  status: String,
  created_at: { type: Date, default: Date.now },
});

// Create model
const Log = mongoose.model('Log', logSchema);

// Standard responses
const OKRESPONSE = { status: 'ok' };
const FORMATERROR = { status: 'error', info: 'malformed json request' };

/* GET home page */
router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

/* POST request → save to MongoDB */
router.post('/', async function (req, res) {
  console.log('POST request received:');
  console.log(req.body);

  try {
    const { settings, data, version, status } = req.body;

    if (!settings) {
      return res.status(400).json({ ...FORMATERROR, err: 'missing settings object' });
    }
    if (!data) {
      return res.status(400).json({ ...FORMATERROR, err: 'missing data object' });
    }
    if (!settings.participant_id) {
      return res.status(400).json({ ...FORMATERROR, err: 'missing participant_id in settings object' });
    }

    // Save log to MongoDB
    await Log.create({
      participant_id: settings.participant_id,
      data,
      version,
      status,
    });

    console.log('+post request saved to MongoDB');
    res.json(OKRESPONSE);
  } catch (err) {
    console.error('MongoDB error:', err);
    res.status(500).json({ status: 'error', info: 'failed to save log' });
  }
});

module.exports = router;
