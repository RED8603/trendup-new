const express = require('express');
const router = express.Router();
const { authenticate } = require('../../auth/middleware/auth.middleware');
const { projectController } = require('../controllers');
const {
    createProjectValidation,
    updateProjectValidation,
    projectIdValidation,
    slugValidation,
    updateModulesValidation,
    teamMemberValidation,
    paginationValidation,
} = require('../validators');
const { validationResult } = require('express-validator');
const { BadRequestError } = require('../../../core/errors/AppError');

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const messages = errors.array().map(e => e.msg).join(', ');
        throw new BadRequestError(messages);
    }
    next();
};

// Optional authentication middleware (for routes that work with or without auth)
const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authenticate(req, res, next);
    }
    next();
};

// ==================== Public Routes ====================

// Get all public projects
router.get('/', paginationValidation, validate, optionalAuth, projectController.getProjects);

// Get project by slug (public)
router.get('/slug/:slug', slugValidation, validate, optionalAuth, projectController.getProjectBySlug);

// Get project by ID
router.get('/:id', projectIdValidation, validate, optionalAuth, projectController.getProject);

// ==================== Protected Routes ====================

// Get current user's projects
router.get('/my/projects', authenticate, paginationValidation, validate, projectController.getMyProjects);

// Create new project
router.post('/', authenticate, createProjectValidation, validate, projectController.createProject);

// Update project
router.put('/:id', authenticate, updateProjectValidation, validate, projectController.updateProject);

// Delete project
router.delete('/:id', authenticate, projectIdValidation, validate, projectController.deleteProject);

// Update module configuration
router.patch('/:id/modules', authenticate, updateModulesValidation, validate, projectController.updateModules);

// Publish project
router.post('/:id/publish', authenticate, projectIdValidation, validate, projectController.publishProject);

// ==================== Team Management Routes ====================

// Add team member
router.post('/:id/team', authenticate, teamMemberValidation, validate, projectController.addTeamMember);

// Remove team member
router.delete('/:id/team/:memberId', authenticate, projectController.removeTeamMember);

module.exports = router;
