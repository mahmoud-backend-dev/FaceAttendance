const { body } = require('express-validator');
const { BadRequest } = require('../../errors');
const validationMiddleWare = require('../../middleware/validatorMiddleware');


exports.addAttendValidator = [
  body('user').notEmpty().withMessage('User Required'),
  body('date').notEmpty().withMessage('Date Required'),
  body('attendance_time').notEmpty().withMessage('Time Required'),
  validationMiddleWare,
]