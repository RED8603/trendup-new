const express = require('express');
const router = express.Router();
const { authenticate } = require('../../auth/middleware/auth.middleware');
const { changeHistoryController } = require('../controllers');
const { paginationValidation } = require('../validators');
const { validationResult } = require('express-validator');
const { param, query } = require('express-validator');
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

const projectIdValidation = [
    param('projectId')
        .isMongoId()
        .withMessage('Invalid project ID'),
];

const historyQueryValidation = [
    query('changeType')
        .optional()
        .isIn([
            'create', 'update', 'delete', 'restore', 'publish', 'unpublish',
            'document_add', 'document_remove', 'module_toggle',
            'team_add', 'team_remove', 'team_update', 'verification', 'ownership_transfer',
        ])
        .withMessage('Invalid change type'),
];

// ==================== Routes ====================

// Get user's activity across all projects
router.get('/activity/me', authenticate, paginationValidation, validate, changeHistoryController.getMyActivity);

// Get project change history
router.get(
    '/:projectId/history',
    authenticate,
    projectIdValidation,
    historyQueryValidation,
    paginationValidation,
    validate,
    changeHistoryController.getProjectHistory
);

// Get project change statistics
router.get(
    '/:projectId/history/stats',
    authenticate,
    projectIdValidation,
    validate,
    changeHistoryController.getProjectStats
);

module.exports = router;
