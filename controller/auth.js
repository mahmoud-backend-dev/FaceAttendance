const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/Users');
const { santizeData } = require('../utils/santizeData');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register =asyncHandler( async (req, res) => {
    req.body.image = `${process.env.BASE_URL}/image/${req.file.filename}`;
    const user = await User.create(req.body);
    const token = user.createJWT();
    res
        .status(StatusCodes.CREATED)
        .json({ user: santizeData(user), token });
});

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new BadRequestError('Please provide email, password');
    const user = await User.findOne({ email });
    if (!user)
        throw new UnauthenticatedError('Invalid Credentials')
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect)
        throw new UnauthenticatedError('Invalid Credentials')
    
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
    register,
    login,
}