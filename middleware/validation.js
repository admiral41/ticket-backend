const { body, validationResult } = require('express-validator');
const { TICKET_STATUS, PRIORITY_LEVEL } = require('../utils/constants');

const validateTicket = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('status')
    .optional()
    .isIn(Object.values(TICKET_STATUS))
    .withMessage('Invalid status value'),
  
  body('priority')
    .optional()
    .isIn(Object.values(PRIORITY_LEVEL))
    .withMessage('Invalid priority value'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = {
  validateTicket
};