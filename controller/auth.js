const fs = require('fs').promises;
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const { santizeData } = require('../utils/santizeData');
const { NotFoundError, BadRequest, UnauthenticatedError } = require('../errors');
const { sendMail } = require('../utils/sendEmail');


const cryptoHashResetCode = (resetCode) => crypto.createHash('sha256').update(resetCode).digest('hex');


exports.allowTo = (...roles) => asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role))
        throw new UnauthenticatedError('You are not allowed to access this route')
    next();
});

// @decs Register As Admin
// @route POST /api/v1/auth/registerAsAdmin
// @ptotect Public
exports.registerAsAdmin = asyncHandler(async (req, res) => {
    const user = await User.findOne({ role: 'admin' });
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    const token = user.createJWT()
    await user.hashPass();
    res.status(StatusCodes.CREATED).json({ status: 'Success', token, user: santizeData(user) });
});


// @decs Register As Manager
// @route POST /api/v1/auth/registerAsManager
// @ptotect Public
exports.registerAsManager = asyncHandler(async (req, res) => {
    const user = await User.findOne({ role: 'manager' });
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    const token = user.createJWT()
    await user.hashPass();
    res.status(StatusCodes.CREATED).json({ status: 'Success', token, user: santizeData(user) });
})



// @decs Register
// @route POST /api/v1/auth/register
// @ptotect Public
exports.register = asyncHandler(async (req, res) => {
    const ext = req.file.mimetype.split('/')[1];
    const idImage = `${req.body.empolyeeId}.${ext}`
    await fs.rename(req.file.path,req.file.path.replace(req.file.filename,idImage))
    req.body.image = `${process.env.BASE_URL}/image/${idImage}`;
    const user = await User.create(req.body);
    const token = user.createJWT();
    res
        .status(StatusCodes.CREATED)
        .json({ status: 'Success', token, user: santizeData(user) });
});

// @decs Login
// @route POST /api/v1/auth/login
// @ptotect Public
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'admin' });
    if (!user)
        throw new NotFoundError(`No such user for this id: ${req.body.email}`)
    const isPasswordCorrect = await user.comparePassword(password);
    if ( !isPasswordCorrect)
        throw new BadRequest('Password incorrect')
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ status: 'Success', token, user: santizeData(user) });
};


// @decs Forget Password
// @route GET /api/v1/auth/getUserId/:id
// @ptotect Private
exports.getUserByID = asyncHandler(async (req, res) => {
    const user = await User.findOne({ empolyeeId: req.params.id });
    res.status(StatusCodes.OK).json({ status: 'Success',  user: santizeData(user) });
});



// @decs Forget Password
// @route POST /api/v1/auth/forgetPassword
// @ptotect Public
exports.forgetPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
        throw new NotFoundError(`No such user for this id: ${req.body.email}`);
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = cryptoHashResetCode(resetCode);
    user.hashedResetCode = hashedResetCode;
    user.expiredResetCode = Date.now() + 10 * 60 * 1000;
    user.verifiyResetCode = false;
    const text =
        `Hi ${user.name}
        G- ${resetCode} is reset code for reset password`;
    const mailOptions = { email: user.email, text };
    try {
        await sendMail(mailOptions);
        await user.save();
    } catch (error) {
        user.hashedResetCode = undefined;
        user.expiredResetCode = undefined;
        user.verifiyResetCode = undefined;
        await user.save();
        throw new CustomErrorAPI(`There is an error in sending email`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    res.status(StatusCodes.OK).json({ status: "Success", message: "Reset Code Sent To Email" });
});

  // @decs Verify Reset Code
  // @route POST /api/v1/auth/verifyResetCode
  // @ptotect Public
exports.verifyResetCode = asyncHandler(async (req, res) => {
    const hashedResetCode = cryptoHashResetCode(req.body.resetCode);
    const user = await User.findOne({
        email: req.body.email,
        hashedResetCode: hashedResetCode,
        expiredResetCode: { $gt: Date.now() }
    });
    if (!user)
        throw new BadRequest(`Reset code invalid or expired or no email for this: ${req.body.email} `);

    user.verifiyResetCode = true;
    await user.save();
    res.status(StatusCodes.OK).json({ status: "Success" });
});

  // @decs Reset Password
  // @route POST /api/v1/auth/resetPassword
  // @ptotect Public
exports.resetPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
        throw new BadRequest(`No such email for this: ${req.body.email}`);
    if (!user.verifiyResetCode)
        throw new BadRequest('Reset code not verified')
    user.password = req.body.newPassword;
    user.hashedResetCode = undefined;
    user.expiredResetCode = undefined;
    user.verifiyResetCode = undefined;
    const token = user.createJWT();
    await user.hashPass();
    res.status(StatusCodes.OK).json({ status: "Success", token, user: santizeData(user) });
});

  // @decs Get All Images
  // @route POST /api/v1/auth/images
  // @ptotect Private
exports.getAllImages = asyncHandler(async (req, res) => {
    const images = await User.find({ image: { $exists: true } }).select('image -_id ');
    const arrayOfImages = images.map((value) => value.image);
    res.status(StatusCodes.OK).json({ status: "Success", count: images.length, arrayOfImages });
})