const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array().map(e => ({
                field: e.path,
                message: e.msg
            }))
        });
    }
    next();
};

const validateRegister = [
    body('email').trim().notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address'),
    body('password').trim().notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    handleValidationErrors
];

const validateLogin = [
    body('email').trim().notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address'),
    body('password').trim().notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

const VALID_JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'];
const VALID_JOB_ROLES = ['Fresher', 'Entry Level', 'Mid Level', 'Senior', 'Intern'];

const validateCreateJob = [
    body('title').trim().notEmpty().withMessage('Job title is required')
        .isLength({ max: 255 }).withMessage('Title must not exceed 255 characters'),
    body('company').trim().notEmpty().withMessage('Company name is required')
        .isLength({ max: 255 }).withMessage('Company must not exceed 255 characters'),
    body('type').trim().notEmpty().withMessage('Job type is required')
        .isIn(VALID_JOB_TYPES).withMessage(`Type must be one of: ${VALID_JOB_TYPES.join(', ')}`),
    body('location').trim().notEmpty().withMessage('Location is required')
        .isLength({ max: 100 }).withMessage('Location must not exceed 100 characters'),
    body('role').trim().notEmpty().withMessage('Role level is required')
        .isIn(VALID_JOB_ROLES).withMessage(`Role must be one of: ${VALID_JOB_ROLES.join(', ')}`),
    handleValidationErrors
];

const validateJobId = [
    param('id').isInt({ min: 1 }).withMessage('Job ID must be a positive integer'),
    handleValidationErrors
];

const validateUpdateJob = [
    param('id').isInt({ min: 1 }).withMessage('Job ID must be a positive integer'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty')
        .isLength({ max: 255 }).withMessage('Title must not exceed 255 characters'),
    body('company').optional().trim().notEmpty().withMessage('Company cannot be empty')
        .isLength({ max: 255 }).withMessage('Company must not exceed 255 characters'),
    body('type').optional().trim().notEmpty().withMessage('Type cannot be empty')
        .isIn(VALID_JOB_TYPES).withMessage(`Type must be one of: ${VALID_JOB_TYPES.join(', ')}`),
    body('location').optional().trim().notEmpty().withMessage('Location cannot be empty')
        .isLength({ max: 100 }).withMessage('Location must not exceed 100 characters'),
    body('role').optional().trim().notEmpty().withMessage('Role cannot be empty')
        .isIn(VALID_JOB_ROLES).withMessage(`Role must be one of: ${VALID_JOB_ROLES.join(', ')}`),
    body().custom((_, { req }) => {
        const allowed = ['title', 'company', 'type', 'location', 'role'];
        const present = allowed.filter(f => req.body[f] !== undefined);
        if (present.length === 0) throw new Error('At least one field must be provided');
        return true;
    }),
    handleValidationErrors
];

const validateJobAlert = [
    body('email').trim().notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address'),
    body('provider').trim().notEmpty().withMessage('Provider is required'),
    handleValidationErrors
];

const validateCreateRoadmap = [
    body('title').trim().notEmpty().withMessage('Title is required')
        .isLength({ max: 255 }).withMessage('Title must not exceed 255 characters'),
    body('description').optional().trim(),
    body('category').optional().trim(),
    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validateCreateJob,
    validateJobId,
    validateUpdateJob,
    validateJobAlert,
    validateCreateRoadmap
};
