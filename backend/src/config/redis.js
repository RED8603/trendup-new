const Redis = require('ioredis');
const config = require('./index');
const { logger } = require('../core/utils/logger');

let redisClient;

const connectRedis = async () => {
  try {
    redisClient = new Redis(config.redis.url, {
      password: config.redis.password,
      retryDelayOnFailover: config.redis.retryDelayOnFailover,
      enableReadyCheck: config.redis.enableReadyCheck,
      maxRetriesPerRequest: config.redis.maxRetriesPerRequest,
      lazyConnect: true
    });

    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('ready', () => {
      logger.info('Redis client ready');
    });

    redisClient.on('error', (err) => {
      logger.error('Redis client error:', err);
    });

    redisClient.on('close', () => {
      logger.warn('Redis client connection closed');
    });

    redisClient.on('reconnecting', () => {
      logger.info('Redis client reconnecting...');
    });

    await redisClient.connect();
    
  } catch (error) {
    logger.error('Redis connection failed:', error);
    process.exit(1);
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

const disconnectRedis = async () => {
  try {
    if (redisClient) {
      await redisClient.quit();
      logger.info('Redis client disconnected');
    }
  } catch (error) {
    logger.error('Error disconnecting Redis:', error);
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  disconnectRedis
};
