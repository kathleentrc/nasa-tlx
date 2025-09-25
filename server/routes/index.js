const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');

// --- MongoDB Connection ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kathleencruz_db_user:Test1234%21@usability.9gwwa87.mongodb.net/nasa_tlx?retryWrites=true&w=majority';

// Connect to MongoDB before handling routes
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 30000, // wait up to 30s for server
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1); // stop server if DB can't connect
});

// --- Define Schema & Model ---
const logSchema = new mongoose.Schema({
  participant_id: { type: String, required: true },
  data: mongoose.Schema.Types.Mixed,
  version: String,
  status: String,
  created_at: { type: Date, default: Date.now },
});

const Log = mongoose.model('Log', logSchema);

// --- Routes ---
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.post('/', async (req, res) => {
  console.log('POST request received:', req.body);

  try {
    const { settings, data, version, status } = req.body;

    if (!settings || !settings.participant_id) {
      return res.status(400).json({ status: 'error', err: 'missing participant_id in settings' });
    }

    // Save log to MongoDB
    await Log.create({
      participant_id: settings.participant_id,
      data,
      version,
      status,
    });

    console.log('Post request saved to MongoDB');
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('MongoDB error:', err.message);
    res.status(500).json({ status: 'error', info: err.message });
  }
});

module.exports = router;
