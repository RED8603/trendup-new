const { Project, Document, ChangeHistory } = require('../models');
const { NotFoundError, ForbiddenError, BadRequestError } = require('../../../core/errors/AppError');
const { logger } = require('../../../core/utils/logger');

class ProjectService {
    /**
     * Create a new project
     */
    async createProject(userId, projectData, reqInfo = {}) {
        const { name, description, shortDescription, logo, links, contractAddress, blockchain, walletAddress, enabledModules, tokenInfo, team, roadmap } = projectData;

        // Generate unique slug from name
        const slug = await Project.generateSlug(name);

        const project = new Project({
            name,
            slug,
            description,
            shortDescription,
            logo,
            links,
            contractAddress,
            blockchain,
            walletAddress,
            enabledModules,
            tokenInfo,
            team,
            roadmap,
            ownerId: userId,
            status: 'draft',
        });

        await project.save();

        // Log creation in change history
        await ChangeHistory.logChange({
            projectId: project._id,
            userId,
            changeType: 'create',
            description: `Created project "${name}"`,
            ipAddress: reqInfo.ip,
            userAgent: reqInfo.userAgent,
        });

        logger.info(`Project created: ${project._id} by user ${userId}`);

        return project;
    }

    /**
     * Update an existing project
     */
    async updateProject(projectId, userId, updates, reqInfo = {}) {
        const project = await Project.findById(projectId);

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        if (!project.canEdit(userId)) {
            throw new ForbiddenError('You do not have permission to edit this project');
        }

        // Track changes for history
        const changes = [];
        const allowedFields = ['name', 'description', 'shortDescription', 'logo', 'links', 'contractAddress', 'blockchain', 'walletAddress', 'enabledModules', 'tokenInfo', 'team', 'roadmap', 'isPublic', 'status'];

        for (const field of allowedFields) {
            if (updates[field] !== undefined && JSON.stringify(project[field]) !== JSON.stringify(updates[field])) {
                changes.push({
                    fieldChanged: field,
                    oldValue: project[field],
                    newValue: updates[field],
                });
                project[field] = updates[field];
            }
        }

        // If name changed, regenerate slug
        if (updates.name && updates.name !== project.name) {
            project.slug = await Project.generateSlug(updates.name);
        }

        await project.save();

        // Log all changes
        for (const change of changes) {
            await ChangeHistory.logChange({
                projectId: project._id,
                userId,
                changeType: 'update',
                fieldChanged: change.fieldChanged,
                oldValue: change.oldValue,
                newValue: change.newValue,
                ipAddress: reqInfo.ip,
                userAgent: reqInfo.userAgent,
            });
        }

        logger.info(`Project updated: ${projectId} by user ${userId}, ${changes.length} fields changed`);

        return project;
    }

    /**
     * Get a single project by ID
     */
    async getProject(projectId, userId = null) {
        const project = await Project.findById(projectId)
            .populate('ownerId', 'name username avatar')
            .populate('teamMembers.userId', 'name username avatar');

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        // Check view permissions
        if (!project.isPublic && !project.canView(userId)) {
            throw new ForbiddenError('You do not have permission to view this project');
        }

        // Get documents
        const documents = await Document.find({ projectId: project._id, isActive: true });

        // Increment view count
        await project.incrementViews();

        return {
            project,
            documents,
        };
    }

    /**
     * Get project by slug (for public access)
     */
    async getProjectBySlug(slug, userId = null) {
        const project = await Project.findOne({ slug })
            .populate('ownerId', 'name username avatar')
            .populate('teamMembers.userId', 'name username avatar');

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        // Check view permissions
        if (!project.isPublic && !project.canView(userId)) {
            throw new ForbiddenError('You do not have permission to view this project');
        }

        // Get public documents only
        const documents = await Document.find({
            projectId: project._id,
            isActive: true,
            isPublic: true,
        });

        // Increment view count
        await project.incrementViews();

        return {
            project,
            documents,
        };
    }

    /**
     * Get projects with filtering and pagination
     */
    async getProjects(filters = {}, pagination = {}) {
        const { status, isPublic, isVerified, search, blockchain } = filters;
        const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;

        const query = {};

        // Default to only showing published, public projects for general listing
        if (status !== undefined) query.status = status;
        if (isPublic !== undefined) query.isPublic = isPublic;
        if (isVerified !== undefined) query.isVerified = isVerified;
        if (blockchain) query.blockchain = blockchain;

        if (search) {
            query.$text = { $search: search };
        }

        const total = await Project.countDocuments(query);
        const projects = await Project.find(query)
            .populate('ownerId', 'name username avatar')
            .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return {
            projects,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get user's projects (owned + team member)
     */
    async getUserProjects(userId, pagination = {}) {
        const { page = 1, limit = 20 } = pagination;

        const query = {
            $or: [
                { ownerId: userId },
                { 'teamMembers.userId': userId },
            ],
        };

        const total = await Project.countDocuments(query);
        const projects = await Project.find(query)
            .populate('ownerId', 'name username avatar')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return {
            projects,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Delete project (soft delete)
     */
    async deleteProject(projectId, userId, reqInfo = {}) {
        const project = await Project.findById(projectId);

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        // Only owner can delete
        if (project.ownerId.toString() !== userId.toString()) {
            throw new ForbiddenError('Only the project owner can delete this project');
        }

        project.isDeleted = true;
        project.deletedAt = new Date();
        project.deletedBy = userId;
        await project.save();

        // Log deletion
        await ChangeHistory.logChange({
            projectId: project._id,
            userId,
            changeType: 'delete',
            description: `Deleted project "${project.name}"`,
            ipAddress: reqInfo.ip,
            userAgent: reqInfo.userAgent,
        });

        logger.info(`Project deleted: ${projectId} by user ${userId}`);

        return { message: 'Project deleted successfully' };
    }

    /**
     * Update module configuration
     */
    async updateModuleConfig(projectId, userId, modules, reqInfo = {}) {
        const project = await Project.findById(projectId);

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        if (!project.canEdit(userId)) {
            throw new ForbiddenError('You do not have permission to edit this project');
        }

        const oldModules = { ...project.enabledModules.toObject() };

        // Update each module toggle
        const allowedModules = ['governance', 'tokenDetails', 'claimsRoadmap', 'audits', 'treasury', 'team', 'whitepaper', 'socialLinks'];

        for (const module of allowedModules) {
            if (modules[module] !== undefined) {
                project.enabledModules[module] = modules[module];
            }
        }

        await project.save();

        // Log module changes
        await ChangeHistory.logChange({
            projectId: project._id,
            userId,
            changeType: 'module_toggle',
            fieldChanged: 'enabledModules',
            oldValue: oldModules,
            newValue: project.enabledModules.toObject(),
            ipAddress: reqInfo.ip,
            userAgent: reqInfo.userAgent,
        });

        logger.info(`Project modules updated: ${projectId} by user ${userId}`);

        return project;
    }

    /**
     * Publish project
     */
    async publishProject(projectId, userId, reqInfo = {}) {
        const project = await Project.findById(projectId);

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        if (!project.canEdit(userId)) {
            throw new ForbiddenError('You do not have permission to publish this project');
        }

        const oldStatus = project.status;
        project.status = 'published';
        project.isPublic = true;
        await project.save();

        // Log publish
        await ChangeHistory.logChange({
            projectId: project._id,
            userId,
            changeType: 'publish',
            fieldChanged: 'status',
            oldValue: oldStatus,
            newValue: 'published',
            ipAddress: reqInfo.ip,
            userAgent: reqInfo.userAgent,
        });

        logger.info(`Project published: ${projectId} by user ${userId}`);

        return project;
    }

    /**
     * Add team member to project
     */
    async addTeamMember(projectId, userId, memberData, reqInfo = {}) {
        const { memberId, role = 'viewer' } = memberData;

        const project = await Project.findById(projectId);

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        // Only owner or admin can add team members
        if (project.ownerId.toString() !== userId.toString()) {
            const userMember = project.teamMembers.find(m => m.userId.toString() === userId.toString());
            if (!userMember || userMember.role !== 'admin') {
                throw new ForbiddenError('You do not have permission to add team members');
            }
        }

        // Check if member already exists
        const existingMember = project.teamMembers.find(m => m.userId.toString() === memberId);
        if (existingMember) {
            throw new BadRequestError('User is already a team member');
        }

        project.teamMembers.push({
            userId: memberId,
            role,
            addedAt: new Date(),
        });

        await project.save();

        // Log team member addition
        await ChangeHistory.logChange({
            projectId: project._id,
            userId,
            changeType: 'team_add',
            description: `Added team member with role: ${role}`,
            metadata: { memberId, role },
            ipAddress: reqInfo.ip,
            userAgent: reqInfo.userAgent,
        });

        return project;
    }

    /**
     * Remove team member from project
     */
    async removeTeamMember(projectId, userId, memberId, reqInfo = {}) {
        const project = await Project.findById(projectId);

        if (!project) {
            throw new NotFoundError('Project not found');
        }

        // Only owner or admin can remove team members
        if (project.ownerId.toString() !== userId.toString()) {
            const userMember = project.teamMembers.find(m => m.userId.toString() === userId.toString());
            if (!userMember || userMember.role !== 'admin') {
                throw new ForbiddenError('You do not have permission to remove team members');
            }
        }

        const memberIndex = project.teamMembers.findIndex(m => m.userId.toString() === memberId);
        if (memberIndex === -1) {
            throw new NotFoundError('Team member not found');
        }

        project.teamMembers.splice(memberIndex, 1);
        await project.save();

        // Log team member removal
        await ChangeHistory.logChange({
            projectId: project._id,
            userId,
            changeType: 'team_remove',
            description: 'Removed team member',
            metadata: { memberId },
            ipAddress: reqInfo.ip,
            userAgent: reqInfo.userAgent,
        });

        return project;
    }
}

module.exports = new ProjectService();
