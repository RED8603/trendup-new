const { Post, Reaction, Comment } = require('../models');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../../../core/errors/AppError');
const { logger } = require('../../../core/utils/logger');

class PostService {
  /**
   * Create a new post
   */
  async createPost(userId, postData) {
    const {
      content,
      postType = 'text',
      category = 'general',
      visibility = 'public',
      mediaUrls = [],
      hashtags = [],
      scheduledAt,
      expiresAt,
      pollOptions,
      pollSettings,
      predictionData,
    } = postData;

    // Validate post type specific data
    if (postType === 'poll' && (!pollOptions || pollOptions.length < 2)) {
      throw new BadRequestError('Poll must have at least 2 options');
    }

    if (postType === 'prediction' && !predictionData?.predictionText) {
      throw new BadRequestError('Prediction must have prediction text');
    }

    // Create post object
    const post = new Post({
      userId,
      content,
      postType,
      category,
      visibility,
      mediaUrls,
      hashtags,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

    // Add poll-specific data
    if (postType === 'poll' && pollOptions) {
      post.pollOptions = pollOptions.map(option => ({
        text: option.text,
        votes: 0,
      }));
      post.pollSettings = {
        expiresAt: pollSettings?.expiresAt ? new Date(pollSettings.expiresAt) : undefined,
        allowMultipleVotes: pollSettings?.allowMultipleVotes || false,
        totalVotes: 0,
      };
    }

    // Add prediction-specific data
    if (postType === 'prediction' && predictionData) {
      post.predictionData = {
        predictionText: predictionData.predictionText,
        targetDate: new Date(predictionData.targetDate),
        outcome: 'pending',
        totalStakedKarma: 0,
        participantsCount: 0,
      };
    }

    await post.save();

    // Populate author data
    await post.populate('author', 'name username avatar karmaScore karmaLevel badges');

    logger.info(`Post created: ${post._id} by user: ${userId}`);

    return { post };
  }

  /**
   * Get posts with filtering and pagination
   */
  async getPosts(options = {}) {
    const {
      page = 1,
      limit = 20,
      category,
      postType,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      hashtag,
      userId,
      status = 'approved',
    } = options;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Build query
    const query = {
      status,
      visibility: 'public',
      isDeleted: false,
    };

    if (category) query.category = category;
    if (postType) query.postType = postType;
    if (userId) query.userId = userId;
    if (hashtag) query.hashtags = hashtag.toLowerCase();

    // Add expiry filter for polls and predictions
    query.$or = [
      { expiresAt: { $exists: false } },
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } },
    ];

    const posts = await Post.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('author', 'name username avatar karmaScore karmaLevel badges');

    const total = await Post.countDocuments(query);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single post by ID
   */
  async getPostById(postId, userId = null) {
    const post = await Post.findOne({
      _id: postId,
      isDeleted: false,
    }).populate('author', 'name username avatar karmaScore karmaLevel badges');

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    // Check visibility
    if (post.visibility === 'private' && post.userId.toString() !== userId) {
      throw new ForbiddenError('Post is private');
    }

    // Increment view count
    await post.incrementViews();

    // Get reactions for this post
    const reactions = await Reaction.getPostReactionCounts(postId);

    // Get user's reactions if userId provided
    let userReactions = [];
    if (userId) {
      userReactions = await Reaction.getUserPostReactions(userId, postId);
    }

    return {
      post,
      reactions,
      userReactions,
    };
  }

  /**
   * Update post
   */
  async updatePost(postId, userId, updates) {
    const post = await Post.findOne({
      _id: postId,
      userId,
      isDeleted: false,
    });

    if (!post) {
      throw new NotFoundError('Post not found or you do not have permission to edit it');
    }

    // Check if post can be edited (not too old or has engagement)
    const hoursSinceCreation = (Date.now() - post.createdAt) / (1000 * 60 * 60);
    const hasEngagement = post.reactionsCount > 0 || post.commentsCount > 0;

    if (hoursSinceCreation > 24 && hasEngagement) {
      throw new BadRequestError('Cannot edit post after 24 hours if it has engagement');
    }

    // Update allowed fields
    const allowedUpdates = ['content', 'category', 'visibility', 'hashtags'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        post[field] = updates[field];
      }
    });

    await post.save();
    await post.populate('author', 'name username avatar karmaScore karmaLevel badges');

    logger.info(`Post updated: ${postId} by user: ${userId}`);

    return { post };
  }

  /**
   * Delete post (soft delete)
   */
  async deletePost(postId, userId) {
    const post = await Post.findOne({
      _id: postId,
      userId,
      isDeleted: false,
    });

    if (!post) {
      throw new NotFoundError('Post not found or you do not have permission to delete it');
    }

    // Soft delete
    post.isDeleted = true;
    post.deletedAt = new Date();
    await post.save();

    logger.info(`Post deleted: ${postId} by user: ${userId}`);

    return { message: 'Post deleted successfully' };
  }

  /**
   * React to a post
   */
  async reactToPost(postId, userId, reactionType) {
    // Check if post exists
    const post = await Post.findOne({
      _id: postId,
      isDeleted: false,
      status: 'approved',
    });

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    // Check if user already has this reaction
    const existingReaction = await Reaction.findOne({
      userId,
      postId,
      reactionType,
    });

    if (existingReaction) {
      // Remove existing reaction
      await Reaction.findByIdAndDelete(existingReaction._id);
      await post.incrementReactions(-1);
      
      logger.info(`Reaction removed: ${reactionType} on post ${postId} by user ${userId}`);
      
      return { 
        message: 'Reaction removed',
        action: 'removed',
        reaction: null,
      };
    }

    // Remove any other reaction by this user on this post
    await Reaction.deleteMany({ userId, postId });

    // Create new reaction
    const reaction = new Reaction({
      userId,
      postId,
      reactionType,
    });

    await reaction.save();
    await post.incrementReactions(1);

    // Populate user data
    await reaction.populate('user', 'name username avatar karmaScore karmaLevel');

    logger.info(`Reaction added: ${reactionType} on post ${postId} by user ${userId}`);

    return {
      message: 'Reaction added',
      action: 'added',
      reaction,
    };
  }

  /**
   * Get post reactions
   */
  async getPostReactions(postId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    // Check if post exists
    const post = await Post.findOne({
      _id: postId,
      isDeleted: false,
    });

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    // Get reaction counts
    const reactionCounts = await Reaction.getPostReactionCounts(postId);

    // Get individual reactions with user data
    const reactions = await Reaction.find({ postId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name username avatar karmaScore karmaLevel');

    const total = await Reaction.countDocuments({ postId });

    return {
      reactionCounts,
      reactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get trending posts
   */
  async getTrendingPosts(timeRange = '24h', limit = 20) {
    return await Post.getTrending(timeRange, limit);
  }

  /**
   * Get user's posts
   */
  async getUserPosts(userId, options = {}) {
    return await this.getPosts({
      ...options,
      userId,
    });
  }

  /**
   * Search posts
   */
  async searchPosts(query, options = {}) {
    const {
      page = 1,
      limit = 20,
      category,
      postType,
    } = options;

    const skip = (page - 1) * limit;

    const searchQuery = {
      $text: { $search: query },
      status: 'approved',
      visibility: 'public',
      isDeleted: false,
    };

    if (category) searchQuery.category = category;
    if (postType) searchQuery.postType = postType;

    const posts = await Post.find(searchQuery, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name username avatar karmaScore karmaLevel badges');

    const total = await Post.countDocuments(searchQuery);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

const postService = new PostService();

module.exports = postService;
