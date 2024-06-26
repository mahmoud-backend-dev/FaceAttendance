const { body,query,param } = require('express-validator');
const { BadRequest } = require('../../errors');
const validationMiddleWare = require('../../middleware/validatorMiddleware');
const Attendance = require('../../models/Attendance');
const User = require('../../models/User');
exports.getAttendanceValidator = [
  query('date').custom(async (val) => {
    const attendace = await Attendance.find({ date: val });
    if (attendace.length === 0)
      throw new BadRequest(`No Data for this day: ${val}`)
  }),
  validationMiddleWare
]

exports.addAttendValidator = [
  body('date').notEmpty().withMessage('Date Required'),
  body('attendance_time').notEmpty().withMessage('Time Required'),
  body('image').custom(async (val, { req }) => {
    if (!req.file)
      throw new BadRequest('Please provide image for image Contant-Type = multipart/form-data or enctype equal multipart/form-data');
  }),
  body('user').notEmpty().withMessage('User Required')
    .custom(async (val, { req }) => {
    const user = await User.findById(val);
      if (!user) {
        throw new BadRequest(`No such email for this :${val}`);
      }
      const now = new Date(req.body.date);
      let attendance = await Attendance.findOne({ user: req.body.user, date: now });
      if (attendance) {
        throw new BadRequest('Already attended')
      }
  }),
  validationMiddleWare,
];

