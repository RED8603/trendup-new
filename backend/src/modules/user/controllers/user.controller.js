const userService = require('../services/user.service');
const { sendSuccessResponse } = require('../../../core/utils/response');
const ErrorHandler = require('../../../core/errors/ErrorHandler');

class UserController {
  async getMyProfile(req, res) {
    const result = await userService.getMyProfile(req.user._id);
    sendSuccessResponse(res, result, 'Profile retrieved successfully');
  }

  async getUserByUsername(req, res) {
    const { username } = req.params;
    const result = await userService.getUserByUsername(username);
    sendSuccessResponse(res, result, 'User retrieved successfully');
  }

  async updateProfile(req, res) {
    const { name, username, bio, location, website } = req.body;
    const result = await userService.updateProfile(req.user._id, {
      name,
      username,
      bio,
      location,
      website
    });
    
    sendSuccessResponse(res, result, result.message);
  }

  async updateAvatar(req, res) {
    if (!req.file) {
      return sendSuccessResponse(res, { message: 'No file uploaded' }, 'No file uploaded', 400);
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const result = await userService.updateAvatar(req.user._id, avatarUrl);
    
    sendSuccessResponse(res, result, result.message);
  }

  async updateCoverImage(req, res) {
    if (!req.file) {
      return sendSuccessResponse(res, { message: 'No file uploaded' }, 'No file uploaded', 400);
    }

    const coverImageUrl = `/uploads/covers/${req.file.filename}`;
    const result = await userService.updateCoverImage(req.user._id, coverImageUrl);
    
    sendSuccessResponse(res, result, result.message);
  }

  async deleteAccount(req, res) {
    const result = await userService.deleteAccount(req.user._id);
    sendSuccessResponse(res, result, result.message);
  }

  async searchUsers(req, res) {
    const { q, limit } = req.query;
    
    if (!q || q.trim().length < 2) {
      return sendSuccessResponse(res, { users: [], count: 0 }, 'Query too short');
    }

    const result = await userService.searchUsers(q, parseInt(limit) || 10);
    sendSuccessResponse(res, result, 'Users retrieved successfully');
  }
}

const userController = new UserController();

module.exports = {
  getMyProfile: ErrorHandler.handleAsync(userController.getMyProfile.bind(userController)),
  getUserByUsername: ErrorHandler.handleAsync(userController.getUserByUsername.bind(userController)),
  updateProfile: ErrorHandler.handleAsync(userController.updateProfile.bind(userController)),
  updateAvatar: ErrorHandler.handleAsync(userController.updateAvatar.bind(userController)),
  updateCoverImage: ErrorHandler.handleAsync(userController.updateCoverImage.bind(userController)),
  deleteAccount: ErrorHandler.handleAsync(userController.deleteAccount.bind(userController)),
  searchUsers: ErrorHandler.handleAsync(userController.searchUsers.bind(userController)),
};

