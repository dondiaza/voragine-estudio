const mongoose = require('mongoose');

let isConnected = false;

const dbConnect = async () => {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri || mongoUri.includes('example')) {
    console.log('Running without database (no MONGODB_URI)');
    return false;
  }
  
  if (isConnected) {
    console.log('Already connected to MongoDB');
    return true;
  }
  
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.log('MongoDB connection failed:', error.message);
    console.log('Continuing without database');
    return false;
  }
};

module.exports = dbConnect;
