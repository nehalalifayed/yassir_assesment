# Air Quality Monitoring API

A Node.js REST API for monitoring air quality using the IQAir API. The application includes real-time air quality data retrieval, automated monitoring of Paris air quality, and historical data analysis.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- IQAir API key (already configured)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/nehalalifayed/yassir_assesment.git
cd yassir_assesment
```

2. Install dependencies:
```bash
npm install
```

3. Configure MongoDB:
   - Ensure MongoDB is running locally on `mongodb://localhost:27017`
   - Or set the `MONGODB_URI` environment variable for a different MongoDB instance

4. Start the application:
```bash
npm start
```

The application will automatically:
- Connect to MongoDB
- Start the Paris air quality monitoring CRON job (runs every minute)
- Begin accepting API requests

## API Endpoints

### 1. Get Air Quality for Coordinates

**Endpoint:** `GET /api/air-quality`

**Query Parameters:**
- `latitude` (required): Latitude coordinate (-90 to 90)
- `longitude` (required): Longitude coordinate (-180 to 180)

**Example Request:**
```bash
curl "http://localhost:3000/api/air-quality?latitude=48.8566&longitude=2.3522"
```

**Example Response:**
```json
{
  "result": {
    "pollution": {
      "ts": "2025-08-07T17:00:00.000Z",
      "aqius": 62,
      "mainus": "p2",
      "aqicn": 21,
      "maincn": "p2"
    }
  }
}
```

**Error Responses:**
- `400`: Missing or invalid parameters
- `500`: API or network errors

### 2. Get Current Paris Air Quality

**Endpoint:** `GET /api/paris/air-quality`

**Example Request:**
```bash
curl "http://localhost:3000/api/paris/air-quality"
```

**Example Response:**
```json
{
  "result": {
    "pollution": {
      "ts": "2025-08-07T17:00:00.000Z",
      "aqius": 62,
      "mainus": "p2",
      "aqicn": 21,
      "maincn": "p2"
    }
  }
}
```

### 3. Get Most Polluted DateTime for Paris

**Endpoint:** `GET /api/paris/most-polluted`

**Example Request:**
```bash
curl "http://localhost:3000/api/paris/most-polluted"
```

**Example Response:**
```json
{
  "datetime": "2025-08-07T15:00:00.000Z",
  "aqius": 80,
  "mainus": "p2"
}
```

**Error Responses:**
- `404`: No air quality data found for Paris

## Data Model

### AirQuality Schema

```javascript
{
  location: {
    latitude: Number,    // Required
    longitude: Number    // Required
  },
  pollution: {
    ts: Date,           // Required - timestamp from IQAir
    aqius: Number,      // Required - US AQI
    mainus: String,     // Required - main pollutant (US)
    aqicn: Number,      // Required - China AQI
    maincn: String      // Required - main pollutant (China)
  },
  createdAt: Date       // Auto-generated timestamp
}
```

## CRON Job

The application includes an automated CRON job that:

- **Frequency**: Runs every minute
- **Location**: Paris (48.856613, 2.352222)
- **Action**: Fetches current air quality and saves to MongoDB
- **Logging**: Console logs for monitoring and debugging

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

The test suite includes:

- **Unit Tests**: Service layer testing with mocked dependencies
- **Integration Tests**: API endpoint testing with in-memory MongoDB
- **Coverage Reports**: HTML and text coverage reports

### Test Structure

```
tests/
├── setup.js              # Global test configuration
├── iqairService.test.js  # Unit tests for IQAir service
└── airQuality.test.js    # Integration tests for API endpoints
```

## Configuration

### Environment Variables

The application uses the following configuration (in `config.js`):

- `IQAIR_API_KEY`: IQAir API key
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Environment mode
- `PARIS_COORDS`: Paris coordinates for monitoring

### Database Indexes

The application creates optimized indexes for:
- Location-based queries (latitude, longitude, timestamp)
- Air quality ranking (AQI US descending)

## Error Handling

The API includes comprehensive error handling:

- **Validation Errors**: Invalid parameters return 400 status
- **API Errors**: IQAir API failures return 500 status
- **Database Errors**: MongoDB connection issues are logged
- **Network Errors**: Connection timeouts and network issues

## Monitoring and Logging

- **Console Logging**: Application startup and CRON job activity
- **Error Logging**: Detailed error messages for debugging
- **Database Logging**: Connection status and query errors

## Performance Considerations

- **Database Indexes**: Optimized for common query patterns
- **Connection Pooling**: MongoDB connection reuse
- **Error Recovery**: Graceful handling of API failures
- **Memory Management**: Proper cleanup of resources

## Security

- **Input Validation**: All parameters are validated
- **Error Sanitization**: Sensitive information is not exposed
- **Rate Limiting**: Consider implementing for production use

## Deployment

### Production Considerations

1. **Environment Variables**: Use proper environment variable management
2. **Database**: Use production MongoDB instance
3. **Monitoring**: Implement proper logging and monitoring
4. **Rate Limiting**: Add rate limiting for API endpoints
5. **SSL/TLS**: Use HTTPS in production
6. **Process Management**: Use PM2 or similar for process management

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.
