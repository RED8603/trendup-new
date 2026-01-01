const { ChangeHistory } = require('../models');
const Project = require('../models/project.model');
const { NotFoundError, ForbiddenError } = require('../../../core/errors/AppError');

class ChangeHistoryService {
    /**
     * Get change history for a project
     */
    async getProjectHistory(projectId, userId, options = {}) {
        const { page = 1, limit = 20, changeType } = options;

        // Verify project exists and user has permission
        const project = await Project.findById(projectId);

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        // Only project owner and team members can view full history
        if (!project.canView(userId)) {
            throw new ForbiddenError('You do not have permission to view this project\'s history');
        }

        return ChangeHistory.getProjectHistory(projectId, { page, limit, changeType });
    }

    /**
     * Get recent activity across all projects for a user
     */
    async getUserActivity(userId, options = {}) {
        const { page = 1, limit = 20 } = options;

        // Get all projects user owns or is a member of
        const projects = await Project.find({
            $or: [
                { ownerId: userId },
                { 'teamMembers.userId': userId },
            ],
        }).select('_id');

        const projectIds = projects.map(p => p._id);

        const total = await ChangeHistory.countDocuments({ projectId: { $in: projectIds } });
        const history = await ChangeHistory.find({ projectId: { $in: projectIds } })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('user', 'name username avatar')
            .populate('projectId', 'name slug logo');

        return {
            history,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get activity by a specific user
     */
    async getActivityByUser(targetUserId, viewerUserId, options = {}) {
        const { page = 1, limit = 20 } = options;

        // Only show activity on public projects unless viewer is the same user
        let query;

        if (targetUserId === viewerUserId) {
            // User viewing their own activity
            query = { userId: targetUserId };
        } else {
            // Someone else viewing - only show public project activity
            const publicProjects = await Project.find({ isPublic: true }).select('_id');
            const publicProjectIds = publicProjects.map(p => p._id);

            query = {
                userId: targetUserId,
                projectId: { $in: publicProjectIds },
            };
        }

        const total = await ChangeHistory.countDocuments(query);
        const history = await ChangeHistory.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('projectId', 'name slug logo');

        return {
            history,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get summary statistics for project changes
     */
    async getProjectChangeStats(projectId, userId) {
        const project = await Project.findById(projectId);

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        if (!project.canView(userId)) {
            throw new ForbiddenError('You do not have permission to view this project\'s statistics');
        }

        const stats = await ChangeHistory.aggregate([
            { $match: { projectId: project._id } },
            {
                $group: {
                    _id: '$changeType',
                    count: { $sum: 1 },
                    lastChange: { $max: '$createdAt' },
                },
            },
        ]);

        const totalChanges = await ChangeHistory.countDocuments({ projectId });
        const lastChange = await ChangeHistory.findOne({ projectId })
            .sort({ createdAt: -1 })
            .populate('user', 'name username avatar');

        return {
            totalChanges,
            lastChange,
            byType: stats.reduce((acc, stat) => {
                acc[stat._id] = { count: stat.count, lastChange: stat.lastChange };
                return acc;
            }, {}),
        };
    }
}

module.exports = new ChangeHistoryService();
