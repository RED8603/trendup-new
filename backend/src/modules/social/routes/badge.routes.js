const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badge.controller');
const { authenticate } = require('../../auth/middleware/auth.middleware');

// Public routes (no authentication required)
router.get('/', badgeController.getAllBadges);
router.get('/stats', badgeController.getBadgeStats);
router.get('/category/:category', badgeController.getBadgesByCategory);
router.get('/rarity/:rarity', badgeController.getBadgesByRarity);
router.get('/:badgeId', badgeController.getBadgeById);
router.get('/users/:userId/available', badgeController.getAvailableBadgesForUser);
router.get('/users/:userId/progress', badgeController.getUserBadgeProgress);

// Protected routes (authentication required)
router.use(authenticate);

// Current user routes
router.get('/me/available', badgeController.getMyAvailableBadges);
router.get('/me/progress', badgeController.getMyBadgeProgress);

// Admin routes (would need admin middleware in production)
router.post('/initialize', badgeController.initializeBadges);
router.post('/', badgeController.createBadge);
router.put('/:badgeId', badgeController.updateBadge);
router.delete('/:badgeId', badgeController.deleteBadge);

module.exports = router;
