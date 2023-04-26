const express = require('express');
const router = express.Router();

const {
  addAttendValidator,
  getAttendanceValidator
} = require('../utils/validators/attendanceValidator');

const {
  addAttendance,
  getAttendanceByDate
} = require('../controller/attendance');

router.post('/', addAttendValidator, addAttendance);
router.get('/', getAttendanceValidator, getAttendanceByDate);
module.exports = router;