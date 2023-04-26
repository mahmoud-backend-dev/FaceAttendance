const { body,query } = require('express-validator');
const { BadRequest } = require('../../errors');
const validationMiddleWare = require('../../middleware/validatorMiddleware');
const Attendance = require('../../models/Attendance');

exports.getAttendanceValidator = [
  query('date').custom(async (val) => {
    const attendace = await Attendance.find({ date: val });
    if (attendace.length === 0)
      throw new BadRequest(`No Data for this day: ${val}`)
  }),
  validationMiddleWare
]

exports.addAttendValidator = [
  body('user').notEmpty().withMessage('User Required'),
  body('date').notEmpty().withMessage('Date Required'),
  body('attendance_time').notEmpty().withMessage('Time Required'),
  validationMiddleWare,
]