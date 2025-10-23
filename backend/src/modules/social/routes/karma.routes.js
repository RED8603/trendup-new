const express = require('express');
const router = express.Router();
const karmaController = require('../controllers/karma.controller');
const { authenticate } = require('../../auth/middleware/auth.middleware');

// Public routes (no authentication required)
router.get('/leaderboard', karmaController.getLeaderboard);
router.get('/stats', karmaController.getKarmaStats);
router.get('/users/level/:level', karmaController.getUsersByLevel);
router.get('/users/:userId', karmaController.getUserKarma);
router.get('/users/:userId/history', karmaController.getUserKarmaHistory);
router.get('/users/:userId/badges', karmaController.getUserBadges);
router.get('/users/:userId/reactions', karmaController.getUserUnlockedReactions);
router.get('/users/:userId/can-use-reaction', karmaController.canUseReaction);
router.get('/users/:userId/reaction-weight', karmaController.getUserReactionWeight);

// Protected routes (authentication required)
router.use(authenticate);

// Current user routes
router.get('/me', karmaController.getMyKarma);
router.get('/me/badges', karmaController.getMyBadges);
router.get('/me/reactions', karmaController.getMyUnlockedReactions);
router.get('/me/history', karmaController.getMyKarmaHistory);

module.exports = router;
