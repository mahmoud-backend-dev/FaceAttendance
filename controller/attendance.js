const fs = require('fs');
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const Attendance = require('../models/Attendance');



// @decs Add Attendance
// @route POST /api/v1/attendance
// @ptotect Private
exports.addAttendance = asyncHandler(async (req, res) => {
  const now = new Date(req.body.date);
  let attendance = await Attendance.findOne({ user: req.body.user, date: now });
  if (attendance) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Already attended' })
  }
  attendance = await Attendance.create(req.body);
  res.status(StatusCodes.OK).json({status:'Success', data: attendance });
});

// @decs Add Face Attendance
// @route PATCH /api/v1/attendance/:id
// @ptotect Private
exports.addFaceAddendance = asyncHandler(async (req, res) => {
  req.body.recognition_face = `${process.env.BASE_URL}/Face/${req.file.filename}`;
  const addFace = await Attendance.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(StatusCodes.OK).json({ status: "Success", data: addFace });
})

// @decs Get Attendance By Date
// @route POST /api/v1/attendance?date=2023-04-27
// @ptotect Private
exports.getAttendanceByDate = asyncHandler(async (req, res) => {
  const attendance = await Attendance.find({ date: req.query.date })
    .populate({ path: 'user', select: 'name empolyeeId department -_id' });
  res.status(StatusCodes.OK).json({ status:'Success',count: attendance.length, data: attendance });
})