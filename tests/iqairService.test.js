const axios = require('axios');
const iqairService = require('../services/iqairService');

// Mock axios
jest.mock('axios');

describe('IQAir Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAirQuality', () => {
    it('should return air quality data for valid coordinates', async () => {
      const mockResponse = {
        data: {
          status: 'success',
          data: {
            current: {
              pollution: {
                ts: '2025-08-07T17:00:00.000Z',
                aqius: 62,
                mainus: 'p2',
                aqicn: 21,
                maincn: 'p2'
              }
            }
          }
        }
      };

      axios.get.mockResolvedValue(mockResponse);

      const result = await iqairService.getAirQuality(48.8566, 2.3522);

      expect(result).toEqual({
        result: {
          pollution: {
            ts: '2025-08-07T17:00:00.000Z',
            aqius: 62,
            mainus: 'p2',
            aqicn: 21,
            maincn: 'p2'
          }
        }
      });

      expect(axios.get).toHaveBeenCalledWith(
        'http://api.airvisual.com/v2/nearest_city',
        {
          params: {
            lat: 48.8566,
            lon: 2.3522,
            key: '759075be-210f-4df2-bb6f-fadee513c00b'
          }
        }
      );
    });

    it('should throw error for API failure', async () => {
      const mockResponse = {
        data: {
          status: 'fail',
          data: {
            message: 'API key invalid'
          }
        }
      };

      axios.get.mockResolvedValue(mockResponse);

      await expect(iqairService.getAirQuality(48.8566, 2.3522))
        .rejects.toThrow('API Error: API key invalid');
    });

    it('should throw error for network issues', async () => {
      axios.get.mockRejectedValue(new Error('Network error'));

      await expect(iqairService.getAirQuality(48.8566, 2.3522))
        .rejects.toThrow('Network Error: Network error');
    });

    it('should throw error for HTTP error responses', async () => {
      const error = new Error('Request failed');
      error.response = {
        status: 401,
        data: {
          message: 'Unauthorized'
        }
      };

      axios.get.mockRejectedValue(error);

      await expect(iqairService.getAirQuality(48.8566, 2.3522))
        .rejects.toThrow('IQAir API Error: 401 - Unauthorized');
    });
  });

  describe('getParisAirQuality', () => {
    it('should call getAirQuality with Paris coordinates', async () => {
      const mockResponse = {
        data: {
          status: 'success',
          data: {
            current: {
              pollution: {
                ts: '2025-08-07T17:00:00.000Z',
                aqius: 62,
                mainus: 'p2',
                aqicn: 21,
                maincn: 'p2'
              }
            }
          }
        }
      };

      axios.get.mockResolvedValue(mockResponse);

      await iqairService.getParisAirQuality();

      expect(axios.get).toHaveBeenCalledWith(
        'http://api.airvisual.com/v2/nearest_city',
        {
          params: {
            lat: 48.856613,
            lon: 2.352222,
            key: '759075be-210f-4df2-bb6f-fadee513c00b'
          }
        }
      );
    });
  });
});
