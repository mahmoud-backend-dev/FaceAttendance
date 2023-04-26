const fs = require('fs').promises;
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/Users');
const { santizeData } = require('../utils/santizeData');
const { NotFoundError, BadRequest } = require('../errors');

exports.register = asyncHandler(async (req, res) => {
    const ext = req.file.mimetype.split('/')[1];
    const idImage = `${req.body.empolyeeId}.${ext}`
    await fs.rename(req.file.path,req.file.path.replace(req.file.filename,idImage))
    req.body.image = `${process.env.BASE_URL}/image/${idImage}`;
    const user = await User.create(req.body);
    const token = user.createJWT();
    res
        .status(StatusCodes.CREATED)
        .json({ user: santizeData(user), token });
});

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'admin' });
    if (!user)
        throw new NotFoundError(`No such user for this id: ${req.body.email}`)
    const isPasswordCorrect = await user.comparePassword(password);
    if ( !isPasswordCorrect)
        throw new BadRequest('Password incorrect')
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: santizeData(user), token });
};

exports.getUserByID = asyncHandler(async (req, res) => {
    const user = await User.findOne({ empolyeeId: req.params.id });
    res.status(StatusCodes.OK).json({ user: santizeData(user) });
})


