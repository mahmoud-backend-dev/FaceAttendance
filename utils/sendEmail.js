const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');
const transportet = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  }
})

module.exports = async (mailOpts) => {
  await transportet.sendMail(mailOpts);
};

