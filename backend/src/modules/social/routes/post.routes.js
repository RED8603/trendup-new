const express = require('express');
const router = express.Router();
const authMiddleware = require('../../auth/middleware/auth.middleware');
const {
  createPostValidation,
  createPollValidation,
  createPredictionValidation,
  updatePostValidation,
  getPostsValidation,
  getPostValidation,
  deletePostValidation,
  reactToPostValidation,
  getPostReactionsValidation,
} = require('../validators/post.validators');
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  reactToPost,
  getPostReactions,
  getTrendingPosts,
  getUserPosts,
  getSearchPosts,
} = require('../controllers/post.controller');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Post CRUD routes
router.post('/', createPostValidation, createPost);
router.get('/', getPostsValidation, getPosts);
router.get('/trending', getTrendingPosts);
router.get('/search', getSearchPosts);
router.get('/user/:userId', getUserPosts);
router.get('/:id', getPostValidation, getPostById);
router.patch('/:id', updatePostValidation, updatePost);
router.delete('/:id', deletePostValidation, deletePost);

// Post interaction routes
router.post('/:id/react', reactToPostValidation, reactToPost);
router.get('/:id/reactions', getPostReactionsValidation, getPostReactions);

module.exports = router;
