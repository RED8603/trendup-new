const express = require('express');
const { getCryptoNews } = require('./news.controller');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiter for news endpoint to prevent abuse
const newsLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30, // 30 requests per minute per IP
    message: {
        success: false,
        message: 'Too many requests, please try again later',
    },
});

router.get('/crypto', newsLimiter, getCryptoNews);

module.exports = router;
