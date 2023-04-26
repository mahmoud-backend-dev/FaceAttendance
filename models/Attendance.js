const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required:true,
  },
  date: {
    type: Date,
  },
  attendance_time: {
    type: String,
  },
  recognition_face: {
    type:String,
  }
});

module.exports = mongoose.model('Attendance', attendanceSchema);