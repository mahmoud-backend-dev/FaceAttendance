
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const Attendance = require('../models/Attendance');


// @decs Add Attendance
// @route POST /api/v1/attendance
// @ptotect Private
exports.addAttendance = asyncHandler(async (req, res) => {
  req.body.recognition_face = req.secure_url;
  attendance = await Attendance.create(req.body);
  res.status(StatusCodes.OK).json({status:'Success', data: attendance });
});


// @decs Get Attendance By Date
// @route POST /api/v1/attendance?date=2023-04-27
// @ptotect Private
exports.getAttendanceByDate = asyncHandler(async (req, res) => {
  const attendance = await Attendance.find({ date: req.query.date })
    .populate({ path: 'user', select: 'name empolyeeId department -_id' });
  res.status(StatusCodes.OK).json({ status:'Success',count: attendance.length, data: attendance });
})