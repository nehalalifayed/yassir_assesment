const axios = require('axios');
const config = require('../config');

class IQAirService {
  constructor() {
    this.baseURL = 'http://api.airvisual.com/v2';
    this.apiKey = config.IQAIR_API_KEY;
  }

  async getAirQuality(latitude, longitude) {
    try {
      const response = await axios.get(`${this.baseURL}/nearest_city`, {
        params: {
          lat: latitude,
          lon: longitude,
          key: this.apiKey
        }
      });

      if (response.data.status === 'success') {
        return {
          result: {
            pollution: response.data.data.current.pollution
          }
        };
      } else {
        throw new Error(`API Error: ${response.data.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      if (error.response) {
        throw new Error(`IQAir API Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
      }
      throw new Error(`Network Error: ${error.message}`);
    }
  }

  async getParisAirQuality() {
    return this.getAirQuality(config.PARIS_COORDS.latitude, config.PARIS_COORDS.longitude);
  }
}

module.exports = new IQAirService();
