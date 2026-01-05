const { projectService } = require('../services');
const { sendSuccessResponse } = require('../../../core/utils/response');
const ErrorHandler = require('../../../core/errors/ErrorHandler');

class ProjectController {
    /**
     * Create a new project
     * POST /api/v1/projects
     */
    async createProject(req, res) {
        const userId = req.user._id;
        const reqInfo = {
            ip: req.ip,
            userAgent: req.get('user-agent'),
        };

        const project = await projectService.createProject(userId, req.body, reqInfo);

        sendSuccessResponse(res, 201, 'Project created successfully', { project });
    }

    /**
     * Get all projects with filters
     * GET /api/v1/projects
     */
    async getProjects(req, res) {
        const { status, isPublic, isVerified, search, blockchain, page, limit, sortBy, sortOrder } = req.query;

        const filters = {};
        if (status) filters.status = status;
        if (isPublic !== undefined) filters.isPublic = isPublic === 'true';
        if (isVerified !== undefined) filters.isVerified = isVerified === 'true';
        if (search) filters.search = search;
        if (blockchain) filters.blockchain = blockchain;

        const pagination = { page, limit, sortBy, sortOrder };

        const result = await projectService.getProjects(filters, pagination);

        sendSuccessResponse(res, 200, 'Projects retrieved successfully', result);
    }

    /**
     * Get current user's projects
     * GET /api/v1/projects/my
     */
    async getMyProjects(req, res) {
        const userId = req.user._id;
        const { page, limit } = req.query;

        const result = await projectService.getUserProjects(userId, { page, limit });

        sendSuccessResponse(res, 200, 'Your projects retrieved successfully', result);
    }

    /**
     * Get single project by ID
     * GET /api/v1/projects/:id
     */
    async getProject(req, res) {
        const { id } = req.params;
        const userId = req.user?._id;

        const result = await projectService.getProject(id, userId);

        sendSuccessResponse(res, 200, 'Project retrieved successfully', result);
    }

    /**
     * Get project by slug (public)
     * GET /api/v1/projects/slug/:slug
     */
    async getProjectBySlug(req, res) {
        const { slug } = req.params;
        const userId = req.user?._id;

        const result = await projectService.getProjectBySlug(slug, userId);

        sendSuccessResponse(res, 200, 'Project retrieved successfully', result);
    }

    /**
     * Update project
     * PUT /api/v1/projects/:id
     */
    async updateProject(req, res) {
        const { id } = req.params;
        const userId = req.user._id;
        const reqInfo = {
            ip: req.ip,
            userAgent: req.get('user-agent'),
        };

        const project = await projectService.updateProject(id, userId, req.body, reqInfo);

        sendSuccessResponse(res, 200, 'Project updated successfully', { project });
    }

    /**
     * Delete project
     * DELETE /api/v1/projects/:id
     */
    async deleteProject(req, res) {
        const { id } = req.params;
        const userId = req.user._id;
        const reqInfo = {
            ip: req.ip,
            userAgent: req.get('user-agent'),
        };

        const result = await projectService.deleteProject(id, userId, reqInfo);

        sendSuccessResponse(res, 200, result.message);
    }

    /**
     * Update module configuration
     * PATCH /api/v1/projects/:id/modules
     */
    async updateModules(req, res) {
        const { id } = req.params;
        const userId = req.user._id;
        const reqInfo = {
            ip: req.ip,
            userAgent: req.get('user-agent'),
        };

        const project = await projectService.updateModuleConfig(id, userId, req.body, reqInfo);

        sendSuccessResponse(res, 200, 'Module configuration updated successfully', { project });
    }

    /**
     * Publish project
     * POST /api/v1/projects/:id/publish
     */
    async publishProject(req, res) {
        const { id } = req.params;
        const userId = req.user._id;
        const reqInfo = {
            ip: req.ip,
            userAgent: req.get('user-agent'),
        };

        const project = await projectService.publishProject(id, userId, reqInfo);

        sendSuccessResponse(res, 200, 'Project published successfully', { project });
    }

    /**
     * Add team member
     * POST /api/v1/projects/:id/team
     */
    async addTeamMember(req, res) {
        const { id } = req.params;
        const userId = req.user._id;
        const reqInfo = {
            ip: req.ip,
            userAgent: req.get('user-agent'),
        };

        const project = await projectService.addTeamMember(id, userId, req.body, reqInfo);

        sendSuccessResponse(res, 200, 'Team member added successfully', { project });
    }

    /**
     * Remove team member
     * DELETE /api/v1/projects/:id/team/:memberId
     */
    async removeTeamMember(req, res) {
        const { id, memberId } = req.params;
        const userId = req.user._id;
        const reqInfo = {
            ip: req.ip,
            userAgent: req.get('user-agent'),
        };

        const project = await projectService.removeTeamMember(id, userId, memberId, reqInfo);

        sendSuccessResponse(res, 200, 'Team member removed successfully', { project });
    }
}

const projectController = new ProjectController();

module.exports = {
    createProject: ErrorHandler.handleAsync(projectController.createProject.bind(projectController)),
    getProjects: ErrorHandler.handleAsync(projectController.getProjects.bind(projectController)),
    getMyProjects: ErrorHandler.handleAsync(projectController.getMyProjects.bind(projectController)),
    getProject: ErrorHandler.handleAsync(projectController.getProject.bind(projectController)),
    getProjectBySlug: ErrorHandler.handleAsync(projectController.getProjectBySlug.bind(projectController)),
    updateProject: ErrorHandler.handleAsync(projectController.updateProject.bind(projectController)),
    deleteProject: ErrorHandler.handleAsync(projectController.deleteProject.bind(projectController)),
    updateModules: ErrorHandler.handleAsync(projectController.updateModules.bind(projectController)),
    publishProject: ErrorHandler.handleAsync(projectController.publishProject.bind(projectController)),
    addTeamMember: ErrorHandler.handleAsync(projectController.addTeamMember.bind(projectController)),
    removeTeamMember: ErrorHandler.handleAsync(projectController.removeTeamMember.bind(projectController)),
};
