module.exports = {
  IQAIR_API_KEY: '759075be-210f-4df2-bb6f-fadee513c00b',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/air_quality_db',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PARIS_COORDS: {
    latitude: 48.856613,
    longitude: 2.352222
  }
};
