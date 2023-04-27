const { body, param} = require('express-validator');
const { BadRequest } = require('../../errors');
const validationMiddleWare = require('../../middleware/validatorMiddleware');
const User = require('../../models/User');

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
];



exports.forgetPasswordValidator = [
  body('email').notEmpty().withMessage('E-mail required'),
  validationMiddleWare,
];

exports.verifyResetCodeValidator = [
  body('email').notEmpty().withMessage('E-mail Required'),
  body('resetCode').notEmpty().withMessage('Reset Code Required'),
  validationMiddleWare
];

exports.resetPasswordValidator = [
  body('email').notEmpty().withMessage('E-mail Required'),
  body('newPassword').notEmpty().withMessage('New Password Required')
    .isLength({ min: 6 }).withMessage('Too short password enter more than 6 characters'), 
  validationMiddleWare
];


exports.registerAsAdminValidator = [
  body('name').notEmpty().withMessage('Name Required'),
  body('email').notEmpty().withMessage('E-mail Required'),
  body('password').notEmpty().withMessage('Password Required')
    .isLength({ min: 6 }).withMessage('Too short password enter more than 6 characters'),
  validationMiddleWare
];


exports.registerAsManagerValidator = [
  body('name').notEmpty().withMessage('Name Required'),
  body('email').notEmpty().withMessage('E-mail Required'),
  body('password').notEmpty().withMessage('Password Required')
    .isLength({ min: 6 }).withMessage('Too short password enter more than 6 characters'), 
  validationMiddleWare
]