const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const config = require('./config');
const { logger } = require('./core/utils/logger');
const ErrorHandler = require('./core/errors/ErrorHandler');

const app = express();

// Trust proxy for rate limiting and IP detection
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors(config.cors));
app.use(compression());

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving removed - using S3 for file storage
// Images are now served directly from S3 bucket with public-read ACL

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.server.env,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
const { authRoutes } = require('./modules/auth');
app.use('/api/v1/auth', authRoutes);

const userRoutes = require('./modules/user/routes/user.routes');
app.use('/api/v1/users', userRoutes);

const { votingRoutes } = require('./modules/voting');
app.use('/api/v1/voting', votingRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: {
      code: 'ROUTE_NOT_FOUND',
      timestamp: new Date().toISOString()
    }
  });
});

// Global error handler
app.use(ErrorHandler.handle);

module.exports = app;
