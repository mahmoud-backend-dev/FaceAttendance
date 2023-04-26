const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const Attendance = require('../models/Attendance');


exports.addAttendance = asyncHandler(async (req, res) => {
  let attendance = await Attendance.findOne({ user: req.body.user });
  if (attendance) 
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Already attended' })
  attendance = await Attendance.create(req.body);
  res.status(StatusCodes.OK).json({ data: attendance });
});

exports.getAttendanceByDate = asyncHandler(async (req, res) => {
  const attendance = await Attendance.find({ date: req.query.date })
    .populate({ path: 'user', select: 'name empolyeeId department -_id' });
  res.status(StatusCodes.OK).json({ count: attendance.length, data: attendance });
})