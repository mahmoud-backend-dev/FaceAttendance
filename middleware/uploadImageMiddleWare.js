const multer = require('multer');
const { BadRequest } = require('../errors');

const multerOptions = (path) => {
    // 1) DisStorage engine
    const multerStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `uploads/${path}`)
        },
        filename: function (req, file, cb) {
            // category-{id}-Date.now().jpeg
            const ext = file.mimetype.split('/')[1];
            const filename = `${path}-${Date.now()}.${ext}`;
            cb(null, filename);
        }
    });
    const filter = (req, file, cb) => {
        if (file.mimetype.startsWith("image"))
            cb(null, true)
        else
            cb(new BadRequest('Only Images allowed'),false)
    }
    const upload = multer({ storage: multerStorage, fileFilter:filter });
    return upload;
}


exports.uploadSingleImage = (fieldName, path) => multerOptions(path).single(fieldName);


exports.uploadMixOfImages = (arrayOfFields) => multerOptions().fields(arrayOfFields); 