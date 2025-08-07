const express = require('express');
const router = express.Router();
const iqairService = require('../services/iqairService');
const AirQuality = require('../models/AirQuality');
const config = require('../config');

// GET /api/air-quality - Get air quality for given coordinates
router.get('/air-quality', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    // Validate required parameters
    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Missing required parameters: latitude and longitude'
      });
    }

    // Validate coordinate format
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        error: 'Invalid coordinates format. Latitude and longitude must be numbers.'
      });
    }
    
    const airQualityData = await iqairService.getAirQuality(lat, lon);
    res.json(airQualityData);
  } catch (error) {
    console.error('Error fetching air quality:', error.message);
    res.status(500).json({
      error: 'Failed to fetch air quality data',
      message: error.message
    });
  }
});

// GET /api/paris/most-polluted - Get datetime when Paris was most polluted
router.get('/paris/most-polluted', async (req, res) => {
  try {
    const mostPollutedRecord = await AirQuality.findOne({
      'location.latitude': config.PARIS_COORDS.latitude,
      'location.longitude': config.PARIS_COORDS.longitude
    }).sort({ 'pollution.aqius': -1 });

    if (!mostPollutedRecord) {
      return res.status(404).json({
        error: 'No air quality data found for Paris'
      });
    }

    res.json({
      datetime: mostPollutedRecord.pollution.ts,
      aqius: mostPollutedRecord.pollution.aqius,
      mainus: mostPollutedRecord.pollution.mainus
    });
  } catch (error) {
    console.error('Error fetching most polluted datetime:', error.message);
    res.status(500).json({
      error: 'Failed to fetch most polluted datetime',
      message: error.message
    });
  }
});

// GET /api/paris/air-quality - Get current Paris air quality
router.get('/paris/air-quality', async (req, res) => {
  try {
    const airQualityData = await iqairService.getParisAirQuality();
    res.json(airQualityData);
  } catch (error) {
    console.error('Error fetching Paris air quality:', error.message);
    res.status(500).json({
      error: 'Failed to fetch Paris air quality data',
      message: error.message
    });
  }
});

module.exports = router;
