const { changeHistoryService } = require('../services');
const { sendSuccessResponse } = require('../../../core/utils/response');
const ErrorHandler = require('../../../core/errors/ErrorHandler');

class ChangeHistoryController {
    /**
     * Get project change history
     * GET /api/v1/projects/:projectId/history
     */
    async getProjectHistory(req, res) {
        const { projectId } = req.params;
        const userId = req.user._id;
        const { page, limit, changeType } = req.query;

        const result = await changeHistoryService.getProjectHistory(
            projectId,
            userId,
            { page, limit, changeType }
        );

        sendSuccessResponse(res, 200, 'Change history retrieved successfully', result);
    }

    /**
     * Get user's activity across all projects
     * GET /api/v1/projects/activity/me
     */
    async getMyActivity(req, res) {
        const userId = req.user._id;
        const { page, limit } = req.query;

        const result = await changeHistoryService.getUserActivity(userId, { page, limit });

        sendSuccessResponse(res, 200, 'Activity retrieved successfully', result);
    }

    /**
     * Get project change statistics
     * GET /api/v1/projects/:projectId/history/stats
     */
    async getProjectStats(req, res) {
        const { projectId } = req.params;
        const userId = req.user._id;

        const stats = await changeHistoryService.getProjectChangeStats(projectId, userId);

        sendSuccessResponse(res, 200, 'Change statistics retrieved successfully', stats);
    }
}

const changeHistoryController = new ChangeHistoryController();

module.exports = {
    getProjectHistory: ErrorHandler.handleAsync(changeHistoryController.getProjectHistory.bind(changeHistoryController)),
    getMyActivity: ErrorHandler.handleAsync(changeHistoryController.getMyActivity.bind(changeHistoryController)),
    getProjectStats: ErrorHandler.handleAsync(changeHistoryController.getProjectStats.bind(changeHistoryController)),
};
