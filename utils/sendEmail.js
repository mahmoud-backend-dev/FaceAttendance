const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  }
});

exports.sendMail = async (mailOptions) => {
  await transporter.sendMail({
    from: 'Face Attendance System <mh15721812@gmail.com>(Mahmoud Hamdi)',
    to: mailOptions.email,
    subject: 'Reset Code For Reset Password',
    text: mailOptions.text
  })
};