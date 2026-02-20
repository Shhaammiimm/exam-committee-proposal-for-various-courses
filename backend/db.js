const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || process.env.ATLAS_URI || 'mongodb://localhost:27017/exam-committee';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

module.exports = { connectDB, mongoose };
