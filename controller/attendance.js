const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const Attendance = require('../models/Attendance');


exports.addAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.create(req.body);
  res.status(StatusCodes.OK).json({ data: attendance });
})