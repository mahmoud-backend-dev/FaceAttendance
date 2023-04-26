const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type:String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default:'user',
    },
    empolyeeId: {
        type: Number,
        unique: true
    },
    department: {
        type: String,
    },
    position: {
        type: String
    },
    image: {
        type:String,
    },

},
    { timestamps: true }
);

UserSchema.hashPass = async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
};

UserSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    });
};

UserSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch
}

module.exports = mongoose.model("User", UserSchema);