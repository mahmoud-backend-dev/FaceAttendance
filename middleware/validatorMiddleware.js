const fs = require('fs');
const { validationResult } = require('express-validator');
const { BadRequest } = require('../errors');

// Finds the validation errors in this request and wraps them in an object with handy functions
const validatorMiddleWare = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        };
        if (req.files) {
            if (req.files.image) {
                fs.unlinkSync(req.files.image[0].path);
            }
            if (req.files.file) {
                fs.unlinkSync(req.files.file[0].path);
            }
        }
        return res.status(400).json({ errors: errors.array() });
    }
    if (req.body.empolyeeId) {
        const ext = req.file.mimetype.split('/')[1];
        const idImage = `${req.body.empolyeeId}.${ext}`
        fs.rename(req.file.path, req.file.path.replace(req.file.filename, idImage), (err) => {
            if (err)
                throw new BadRequest(`Error rename file: ${err}`)
        });
    };
    next()
}

module.exports = validatorMiddleWare;