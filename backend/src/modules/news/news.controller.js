const axios = require('axios');
const redisService = require('../../core/services/redis.service');
const { sendSuccessResponse } = require('../../core/utils/response');
const ErrorHandler = require('../../core/errors/ErrorHandler');
const mockNewsData = require('./mock-news.data');

class NewsController {
    async getCryptoNews(req, res) {
        const CACHE_KEY = 'crypto_panic_news';
        const CACHE_DURATION = 900; // 15 minutes in seconds

        // Try to get from cache first
        const cachedData = await redisService.getCached(CACHE_KEY);
        if (cachedData) {
            return sendSuccessResponse(res, cachedData, 'News fetched from cache');
        }

        // Fetch fresh data
        const CRYPTO_NEWS_URL = 'https://cryptopanic.com/api/developer/v2/posts/';
        // Use env variable or fallback for dev if needed, strictly avoiding hardcoding real tokens if possible, 
        // but user shared token explicitly in prompt so using process.env or the token from their request if env not set
        const token = process.env.CRYPTOPANIC_TOKEN || '1239fe5403f886ce279cc98328f81fd85e0ab932'; // User provided token

        try {
            const response = await axios.get(CRYPTO_NEWS_URL, {
                params: {
                    auth_token: token,
                    public: 'true'
                }
            });

            const newsData = response.data;

            // Cache the result
            await redisService.cache(CACHE_KEY, newsData, CACHE_DURATION);

            sendSuccessResponse(res, newsData, 'News fetched successfully');
        } catch (error) {
            console.error('CryptoNews API Error:', error.message);
            if (error.response) {
                console.error('Upstream Response:', error.response.status, error.response.data);
            }

            console.warn('Falling back to mock news data due to API error.');

            // Fallback to mock data
            await redisService.cache(CACHE_KEY, mockNewsData, 300); // Cache mock data for 5 mins

            return sendSuccessResponse(res, mockNewsData, 'News fetched from fallback (Mock Mode)');
        }
    }
}

const newsController = new NewsController();

module.exports = {
    getCryptoNews: ErrorHandler.handleAsync(newsController.getCryptoNews.bind(newsController))
};
