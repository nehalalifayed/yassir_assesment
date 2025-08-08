# Air Quality Monitoring API

A Node.js REST API for monitoring air quality using the IQAir API. The application includes real-time air quality data retrieval, automated monitoring of Paris air quality, and historical data analysis.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- IQAir API key (already configured)

## Installation

1. Download the code

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
## API Endpoints

### 1. Get Air Quality for Coordinates

**Endpoint:** `GET /api/air-quality`

**Query Parameters:**
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate

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

### Test Structure

```
tests/
├── setup.js              # Global test configuration
└── airQuality.test.js    # Integration tests for API endpoints
```

## Configuration

### Environment Variables

The application uses the following configuration (in `config.js`):

- `IQAIR_API_KEY`: IQAir API key
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Environment mode
- `PARIS_COORDS`: Paris coordinates for monitoring