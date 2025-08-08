const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Import the app
const app = require('../app');

let mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect to in-memory database
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

describe('Air Quality API', () => {
  describe('GET /api/air-quality', () => {
    it('should return 400 for missing parameters', async () => {
      const response = await request(app)
        .get('/api/air-quality')
        .expect(400);

      expect(response.body.error).toBe('Missing required parameters: latitude and longitude');
    });

    it('should return 200 for valid coordinates', async () => {
      const response = await request(app)
        .get('/api/air-quality?latitude=48.8566&longitude=2.3522')
        .expect(200);

      // Check response structure
      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveProperty('pollution');
      
      // Check pollution data structure
      const pollution = response.body.result.pollution;
      expect(pollution).toHaveProperty('ts');
      expect(pollution).toHaveProperty('aqius');
      expect(pollution).toHaveProperty('mainus');
      expect(pollution).toHaveProperty('aqicn');
      expect(pollution).toHaveProperty('maincn');
      
      // Check data types
      expect(typeof pollution.aqius).toBe('number');
      expect(typeof pollution.mainus).toBe('string');
      expect(typeof pollution.aqicn).toBe('number');
      expect(typeof pollution.maincn).toBe('string');
      expect(typeof pollution.ts).toBe('string');
    });
  });

  describe('GET /api/paris/most-polluted', () => {
    it('should return 404 when no data exists', async () => {
      const response = await request(app)
        .get('/api/paris/most-polluted')
        .expect(404);

      expect(response.body.error).toBe('No air quality data found for Paris');
    });

    it('should return most polluted datetime when data exists', async () => {
      // Insert test data
      const AirQuality = require('../models/AirQuality');
      const testData = [
        {
          location: { latitude: 48.856613, longitude: 2.352222 },
          pollution: {
            ts: '2025-08-07T10:00:00.000Z',
            aqius: 50,
            mainus: 'p2',
            aqicn: 20,
            maincn: 'p2'
          }
        },
        {
          location: { latitude: 48.856613, longitude: 2.352222 },
          pollution: {
            ts: '2025-08-07T15:00:00.000Z',
            aqius: 80,
            mainus: 'p2',
            aqicn: 30,
            maincn: 'p2'
          }
        }
      ];

      await AirQuality.insertMany(testData);

      const response = await request(app)
        .get('/api/paris/most-polluted')
        .expect(200);

      expect(response.body.datetime).toBe('2025-08-07T15:00:00.000Z');
      expect(response.body.aqius).toBe(80);
      expect(response.body.mainus).toBe('p2');
    });
  });
});
