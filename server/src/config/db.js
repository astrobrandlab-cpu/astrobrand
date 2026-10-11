const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    // Check if we want to use memory server as fallback for testing
    if (uri === 'mongodb://localhost:27017/astrobrand' || !uri) {
      try {
        // Try connecting to local MongoDB first
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
        return;
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Local MongoDB not found, falling back to in-memory database for development...');
          const { MongoMemoryServer } = require('mongodb-memory-server');
          mongod = await MongoMemoryServer.create();
          uri = mongod.getUri();
        } else {
          throw e;
        }
      }
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
