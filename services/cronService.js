const cron = require('node-cron');
const AirQuality = require('../models/AirQuality');
const iqairService = require('./iqairService');
const config = require('../config');

class CronService {
  constructor() {
    this.isRunning = false;
  }

  startParisAirQualityCron() {
    if (this.isRunning) {
      console.log('Cron job is already running');
      return;
    }

    // Run every minute
    cron.schedule('* * * * *', async () => {
      try {
        console.log('Checking Paris air quality...');
        const airQualityData = await iqairService.getParisAirQuality();
        
        const airQuality = new AirQuality({
          location: {
            latitude: config.PARIS_COORDS.latitude,
            longitude: config.PARIS_COORDS.longitude
          },
          pollution: airQualityData.result.pollution
        });

        await airQuality.save();
        console.log(`Paris air quality saved: AQI US ${airQualityData.result.pollution.aqius} at ${new Date().toISOString()}`);
      } catch (error) {
        console.error('Error in Paris air quality cron job:', error.message);
      }
    });

    this.isRunning = true;
    console.log('Paris air quality cron job started - running every minute');
  }
}

module.exports = new CronService();
