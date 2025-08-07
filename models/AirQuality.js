const mongoose = require('mongoose');

const airQualitySchema = new mongoose.Schema({
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  pollution: {
    ts: { type: Date, required: true },
    aqius: { type: Number, required: true },
    mainus: { type: String, required: true },
    aqicn: { type: Number, required: true },
    maincn: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

// Index for efficient queries
airQualitySchema.index({ 'location.latitude': 1, 'location.longitude': 1, createdAt: -1 });
airQualitySchema.index({ 'pollution.aqius': -1 });

module.exports = mongoose.model('AirQuality', airQualitySchema);
