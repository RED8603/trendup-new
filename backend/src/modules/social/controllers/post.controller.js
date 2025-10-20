const postService = require('../services/post.service');
const { sendSuccessResponse } = require('../../../core/utils/response');
const ErrorHandler = require('../../../core/errors/ErrorHandler');

class PostController {
  /**
   * Create a new post
   */
  async createPost(req, res) {
    const userId = req.user._id;
    const postData = req.body;

    const result = await postService.createPost(userId, postData);
    sendSuccessResponse(res, result, 'Post created successfully', 201);
  }

  /**
   * Get posts with filtering and pagination
   */
  async getPosts(req, res) {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      category: req.query.category,
      postType: req.query.postType,
      sortBy: req.query.sortBy || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc',
      hashtag: req.query.hashtag,
      userId: req.query.userId,
    };

    const result = await postService.getPosts(options);
    sendSuccessResponse(res, result, 'Posts retrieved successfully');
  }

  /**
   * Get single post by ID
   */
  async getPostById(req, res) {
    const { id } = req.params;
    const userId = req.user?._id;

    const result = await postService.getPostById(id, userId);
    sendSuccessResponse(res, result, 'Post retrieved successfully');
  }

  /**
   * Update post
   */
  async updatePost(req, res) {
    const { id } = req.params;
    const userId = req.user._id;
    const updates = req.body;

    const result = await postService.updatePost(id, userId, updates);
    sendSuccessResponse(res, result, 'Post updated successfully');
  }

  /**
   * Delete post
   */
  async deletePost(req, res) {
    const { id } = req.params;
    const userId = req.user._id;

    const result = await postService.deletePost(id, userId);
    sendSuccessResponse(res, result, result.message);
  }

  /**
   * React to a post
   */
  async reactToPost(req, res) {
    const { id } = req.params;
    const userId = req.user._id;
    const { reactionType } = req.body;

    const result = await postService.reactToPost(id, userId, reactionType);
    sendSuccessResponse(res, result, result.message);
  }

  /**
   * Get post reactions
   */
  async getPostReactions(req, res) {
    const { id } = req.params;
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
    };

    const result = await postService.getPostReactions(id, options);
    sendSuccessResponse(res, result, 'Post reactions retrieved successfully');
  }

  /**
   * Get trending posts
   */
  async getTrendingPosts(req, res) {
    const timeRange = req.query.timeRange || '24h';
    const limit = parseInt(req.query.limit) || 20;

    const posts = await postService.getTrendingPosts(timeRange, limit);
    sendSuccessResponse(res, { posts }, 'Trending posts retrieved successfully');
  }

  /**
   * Get user's posts
   */
  async getUserPosts(req, res) {
    const { userId } = req.params;
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      category: req.query.category,
      postType: req.query.postType,
      sortBy: req.query.sortBy || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc',
    };

    const result = await postService.getUserPosts(userId, options);
    sendSuccessResponse(res, result, 'User posts retrieved successfully');
  }

  /**
   * Search posts
   */
  async searchPosts(req, res) {
    const { q } = req.query;
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      category: req.query.category,
      postType: req.query.postType,
    };

    if (!q || q.trim().length < 2) {
      return sendSuccessResponse(res, { posts: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } }, 'Query too short');
    }

    const result = await postService.searchPosts(q, options);
    sendSuccessResponse(res, result, 'Search results retrieved successfully');
  }
}

const postController = new PostController();

module.exports = {
  createPost: ErrorHandler.handleAsync(postController.createPost.bind(postController)),
  getPosts: ErrorHandler.handleAsync(postController.getPosts.bind(postController)),
  getPostById: ErrorHandler.handleAsync(postController.getPostById.bind(postController)),
  updatePost: ErrorHandler.handleAsync(postController.updatePost.bind(postController)),
  deletePost: ErrorHandler.handleAsync(postController.deletePost.bind(postController)),
  reactToPost: ErrorHandler.handleAsync(postController.reactToPost.bind(postController)),
  getPostReactions: ErrorHandler.handleAsync(postController.getPostReactions.bind(postController)),
  getTrendingPosts: ErrorHandler.handleAsync(postController.getTrendingPosts.bind(postController)),
  getUserPosts: ErrorHandler.handleAsync(postController.getUserPosts.bind(postController)),
  getSearchPosts: ErrorHandler.handleAsync(postController.searchPosts.bind(postController)),
};
