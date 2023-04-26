const { body, param} = require('express-validator');
const { BadRequest } = require('../../errors');
const validationMiddleWare = require('../../middleware/validatorMiddleware');
const User = require('../../models/Users');

exports.registerValidator = [
  body('name').notEmpty().withMessage('Name Required'),
  body('empolyeeId').notEmpty().withMessage('Empolyee Id Required')
    .custom(async (val) => {
      const user = await User.findOne({ empolyeeId: val });
      if (user)
        throw new BadRequest('Empolyee Id must be unique')
    }),
  body('department').notEmpty().withMessage('Department  Required'),
  body('position').notEmpty().withMessage('Position Required'),
  body('image').custom(async (val, { req }) => {
    if (!req.file)
      throw new BadRequest('Please provide image for image Contant-Type = multipart/form-data or enctype equal multipart/form-data');
  }),
  validationMiddleWare,
];



exports.getUserValidator = [
  param('id').custom(async (val) => {
    const user = await User.findOne({ empolyeeId: val });
    if (!user)
      throw new BadRequest(`No user such as this id: ${val}`);
  }),
  validationMiddleWare
]