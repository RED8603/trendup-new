const app = require('./app');
const { connectDatabase } = require('./config/database');
const { connectRedis } = require('./config/redis');
const { logger } = require('./core/utils/logger');
const config = require('./config');

async function startServer() {
  try {
    console.log('[INFO] Starting TrendUp Backend Server...');
    console.log(`[INFO] Environment: ${config.server.env}`);
    console.log(`[INFO] Host: ${config.server.host}`);
    console.log(`[INFO] Port: ${config.server.port}`);
    
    // Log configuration
    console.log('[INFO] Configuration loaded:');
    console.log(`[INFO]   - MongoDB URI: ${config.database.uri ? 'Set' : 'Not set'}`);
    console.log(`[INFO]   - Redis URL: ${config.redis.url ? 'Set' : 'Not set'}`);
    console.log(`[INFO]   - JWT Secret: ${config.jwt.secret ? 'Set' : 'Not set'}`);

    // Connect to database
    console.log('[INFO] Attempting to connect to MongoDB...');
    try {
      await connectDatabase();
      console.log('[INFO] Database connected successfully');
      logger.info('Database connected successfully');
    } catch (dbError) {
      console.error('[ERROR] Database connection failed:');
      console.error('[ERROR]   Error:', dbError.message);
      console.error('[ERROR]   Code:', dbError.code);
      console.error('[ERROR]   URI:', config.database.uri);
      logger.error('Database connection failed:', {
        error: dbError.message,
        code: dbError.code,
        uri: config.database.uri,
        stack: dbError.stack
      });
      throw dbError;
    }

    // Connect to Redis
    console.log('[INFO] Attempting to connect to Redis...');
    try {
      await connectRedis();
      console.log('[INFO] Redis connected successfully');
      logger.info('Redis connected successfully');
    } catch (redisError) {
      console.error('[ERROR] Redis connection failed:');
      console.error('[ERROR]   Error:', redisError.message);
      console.error('[ERROR]   Code:', redisError.code);
      console.error('[ERROR]   URL:', config.redis.url);
      logger.error('Redis connection failed:', {
        error: redisError.message,
        code: redisError.code,
        url: config.redis.url,
        stack: redisError.stack
      });
      throw redisError;
    }

    // Start server
    console.log('[INFO] Starting HTTP server...');
    const server = app.listen(config.server.port, config.server.host, (error) => {
      if (error) {
        console.error('[ERROR] Failed to start HTTP server:', error.message);
        logger.error('Failed to start HTTP server:', {
          error: error.message,
          stack: error.stack
        });
        process.exit(1);
      } else {
        console.log('[INFO] Server started successfully!');
        console.log(`[INFO]   URL: http://${config.server.host}:${config.server.port}`);
        console.log(`[INFO]   Health: http://${config.server.host}:${config.server.port}/health`);
        console.log(`[INFO]   API: http://${config.server.host}:${config.server.port}/api/v1`);
        logger.info(`Server running on http://${config.server.host}:${config.server.port} in ${config.server.env} mode`);
      }
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('[ERROR] Server error:', error.message);
      logger.error('Server error:', {
        error: error.message,
        code: error.code,
        stack: error.stack
      });
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('[INFO] SIGTERM received. Shutting down gracefully...');
      logger.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('[INFO] Process terminated');
        logger.info('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('[INFO] SIGINT received. Shutting down gracefully...');
      logger.info('SIGINT received. Shutting down gracefully...');
      server.close(() => {
        console.log('[INFO] Process terminated');
        logger.info('Process terminated');
        process.exit(0);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('[ERROR] Uncaught Exception:', error.message);
      console.error('[ERROR] Stack:', error.stack);
      logger.error('Uncaught Exception:', {
        error: error.message,
        stack: error.stack,
        name: error.name
      });
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('[ERROR] Unhandled Rejection at:', promise);
      console.error('[ERROR] Reason:', reason);
      logger.error('Unhandled Rejection:', {
        reason: reason,
        promise: promise
      });
      process.exit(1);
    });

  } catch (error) {
    console.error('[ERROR] Failed to start server:');
    console.error('[ERROR]   Error:', error.message);
    console.error('[ERROR]   Name:', error.name);
    console.error('[ERROR]   Code:', error.code);
    console.error('[ERROR]   Stack:', error.stack);
    
    logger.error('Failed to start server:', {
      error: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack
    });
    
    console.log('[INFO] Exiting process...');
    process.exit(1);
  }
}

startServer();
