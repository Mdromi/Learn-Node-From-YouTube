const multer  = require('multer');
const path = require('path');

// file upload folder
const UPLOAD_FOLDERS = 'public/uploads';

// define the storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_FOLDERS)
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
});

// prepare the final multer upload object
const upload = multer({
    storage,
    limits: {
        fieldSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        const types = /jpeg|jpg|png|gif/
        const extName = types.test(path.extname(file.originalname).toLowerCase())
        const mineType = types.test(file.mimetype)

        if(extName && mineType) {
            cb(null, true)
        } else {
            cb(new Error('Only Support Images'))
        }
    }
});

module.exports = upload;