const express = require('express');
const {
  getMyProfile,
  getUserByUsername,
  updateProfile,
  updateAvatar,
  updateCoverImage,
  deleteAccount,
  searchUsers,
} = require('../controllers/user.controller');
const {
  updateProfileValidator,
  usernameParamValidator,
  searchQueryValidator,
} = require('../validators/user.validators');
const authMiddleware = require('../../auth/middleware/auth.middleware');
const { uploadAvatar, uploadCover } = require('../middleware/upload.middleware');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiters
const updateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many update requests, please try again later',
  },
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    success: false,
    message: 'Too many upload requests, please try again later',
  },
});

// Public routes
router.get(
  '/search',
  searchQueryValidator,
  searchUsers
);

router.get(
  '/:username',
  usernameParamValidator,
  getUserByUsername
);

// Protected routes (require authentication)
router.get(
  '/me',
  authMiddleware,
  getMyProfile
);

router.patch(
  '/profile',
  authMiddleware,
  updateLimiter,
  updateProfileValidator,
  updateProfile
);

router.post(
  '/avatar',
  authMiddleware,
  uploadLimiter,
  uploadAvatar,
  updateAvatar
);

router.post(
  '/cover',
  authMiddleware,
  uploadLimiter,
  uploadCover,
  updateCoverImage
);

router.delete(
  '/account',
  authMiddleware,
  deleteAccount
);

module.exports = router;

