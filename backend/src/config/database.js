const mongoose = require('mongoose');
const config = require('./index');
const { logger } = require('../core/utils/logger');

const connectDatabase = async () => {
  try {
    const mongoUri = config.server.env === 'test' ? config.database.testUri : config.database.uri;
    
    console.log(`[INFO] Connecting to MongoDB...`);
    console.log(`[INFO]   URI: ${mongoUri}`);
    console.log(`[INFO]   Options:`, config.database.options);
    
    const conn = await mongoose.connect(mongoUri, config.database.options);
    
    console.log(`[INFO] MongoDB Connected successfully!`);
    console.log(`[INFO]   Host: ${conn.connection.host}`);
    console.log(`[INFO]   Port: ${conn.connection.port}`);
    console.log(`[INFO]   Database: ${conn.connection.name}`);
    console.log(`[INFO]   Ready State: ${conn.connection.readyState}`);
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('[ERROR] MongoDB connection error:', err.message);
      logger.error('MongoDB connection error:', {
        error: err.message,
        stack: err.stack,
        name: err.name
      });
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[WARN] MongoDB disconnected');
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[INFO] MongoDB reconnected');
      logger.info('MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('[INFO] Closing MongoDB connection...');
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('[ERROR] Database connection failed:');
    console.error('[ERROR]   Error:', error.message);
    console.error('[ERROR]   Name:', error.name);
    console.error('[ERROR]   Code:', error.code);
    console.error('[ERROR]   URI:', config.database.uri);
    
    logger.error('Database connection failed:', {
      error: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      uri: config.database.uri
    });
    
    // Don't exit here, let the server handle it
    throw error;
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    logger.info('Database disconnected');
  } catch (error) {
    logger.error('Error disconnecting database:', {
      error: error.message,
      stack: error.stack
    });
  }
};

module.exports = {
  connectDatabase,
  disconnectDatabase
};
