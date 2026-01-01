const { body, param, query } = require('express-validator');

const createProjectValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Project name is required')
        .isLength({ max: 100 })
        .withMessage('Project name cannot exceed 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 5000 })
        .withMessage('Description cannot exceed 5000 characters'),
    body('shortDescription')
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage('Short description cannot exceed 300 characters'),
    body('links.website')
        .optional()
        .trim()
        .isURL()
        .withMessage('Invalid website URL'),
    body('links.twitter')
        .optional()
        .trim(),
    body('links.discord')
        .optional()
        .trim(),
    body('links.telegram')
        .optional()
        .trim(),
    body('links.github')
        .optional()
        .trim(),
    body('blockchain')
        .optional()
        .isIn(['ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism', 'avalanche', 'solana', 'other'])
        .withMessage('Invalid blockchain'),
    body('enabledModules.governance')
        .optional()
        .isBoolean()
        .withMessage('Invalid value for governance module'),
    body('enabledModules.tokenDetails')
        .optional()
        .isBoolean()
        .withMessage('Invalid value for tokenDetails module'),
    body('enabledModules.claimsRoadmap')
        .optional()
        .isBoolean()
        .withMessage('Invalid value for claimsRoadmap module'),
    body('enabledModules.audits')
        .optional()
        .isBoolean()
        .withMessage('Invalid value for audits module'),
    body('enabledModules.treasury')
        .optional()
        .isBoolean()
        .withMessage('Invalid value for treasury module'),
    body('enabledModules.team')
        .optional()
        .isBoolean()
        .withMessage('Invalid value for team module'),
    body('enabledModules.whitepaper')
        .optional()
        .isBoolean()
        .withMessage('Invalid value for whitepaper module'),
    body('enabledModules.socialLinks')
        .optional()
        .isBoolean()
        .withMessage('Invalid value for socialLinks module'),
];

const updateProjectValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid project ID'),
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Project name cannot be empty')
        .isLength({ max: 100 })
        .withMessage('Project name cannot exceed 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 5000 })
        .withMessage('Description cannot exceed 5000 characters'),
    body('links.website')
        .optional()
        .trim()
        .isURL()
        .withMessage('Invalid website URL'),
    body('status')
        .optional()
        .isIn(['draft', 'published', 'archived'])
        .withMessage('Invalid status'),
    body('isPublic')
        .optional()
        .isBoolean()
        .withMessage('isPublic must be a boolean'),
];

const projectIdValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid project ID'),
];

const slugValidation = [
    param('slug')
        .trim()
        .notEmpty()
        .withMessage('Slug is required'),
];

const updateModulesValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid project ID'),
    body('governance')
        .optional()
        .isBoolean()
        .withMessage('governance must be a boolean'),
    body('tokenDetails')
        .optional()
        .isBoolean()
        .withMessage('tokenDetails must be a boolean'),
    body('claimsRoadmap')
        .optional()
        .isBoolean()
        .withMessage('claimsRoadmap must be a boolean'),
    body('audits')
        .optional()
        .isBoolean()
        .withMessage('audits must be a boolean'),
    body('treasury')
        .optional()
        .isBoolean()
        .withMessage('treasury must be a boolean'),
    body('team')
        .optional()
        .isBoolean()
        .withMessage('team must be a boolean'),
    body('whitepaper')
        .optional()
        .isBoolean()
        .withMessage('whitepaper must be a boolean'),
    body('socialLinks')
        .optional()
        .isBoolean()
        .withMessage('socialLinks must be a boolean'),
];

const teamMemberValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid project ID'),
    body('memberId')
        .isMongoId()
        .withMessage('Invalid member ID'),
    body('role')
        .optional()
        .isIn(['admin', 'editor', 'viewer'])
        .withMessage('Invalid role'),
];

const paginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
];

module.exports = {
    createProjectValidation,
    updateProjectValidation,
    projectIdValidation,
    slugValidation,
    updateModulesValidation,
    teamMemberValidation,
    paginationValidation,
};
