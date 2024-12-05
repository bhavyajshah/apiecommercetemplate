const { body } = require('express-validator');
const validate = require('../middleware/validator');

exports.validateTemplate = validate([
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters')
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage('Name can only contain letters, numbers, spaces, and hyphens'),
  
  body('category')
    .isIn(['nextjs', 'reactjs', 'vuejs', 'angular', 'other'])
    .withMessage('Invalid category'),
  
  body('description')
    .trim()
    .isLength({ min: 50, max: 1000 })
    .withMessage('Description must be between 50 and 1000 characters'),
  
  body('price')
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Price must be between 0 and 1000'),
  
  body('downloadUrl')
    .isURL()
    .withMessage('Invalid download URL'),
  
  body('thumbnailUrl')
    .optional()
    .isURL()
    .withMessage('Invalid thumbnail URL'),
  
  body('features')
    .isArray()
    .withMessage('Features must be an array')
    .custom(features => features.every(f => typeof f === 'string' && f.length <= 100))
    .withMessage('Each feature must be a string with maximum 100 characters'),
  
  body('tags')
    .isArray()
    .withMessage('Tags must be an array')
    .custom(tags => tags.every(t => typeof t === 'string' && t.length <= 20))
    .withMessage('Each tag must be a string with maximum 20 characters')
]);