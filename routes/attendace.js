const express = require('express');
const router = express.Router();

const {
  addAttendValidator
} = require('../utils/validators/attendanceValidator');

const {
  addAttendance
} = require('../controller/attendance');

router.post('/', addAttendValidator, addAttendance);

module.exports = router;