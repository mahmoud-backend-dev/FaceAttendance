const { body } = require('express-validator');
const { BadRequest } = require('../../errors');
const validationMiddleWare = require('../../middleware/validatorMiddleware');

exports.registerValidator = [
  body('name').notEmpty().withMessage('Name Required'),
  body('empolyeeId').notEmpty().withMessage('Empolyee Id Required'),
  body('department').notEmpty().withMessage('Department  Required'),
  body('position').notEmpty().withMessage('Position Required'),
  body('image').custom(async (val,{req}) => {
    if (!req.file)
      throw new BadRequest('Please provide image for question and enctype equal multipart/form-data');
  }),
  validationMiddleWare,
]