const multer = require('multer');
const path = require('path');
const fs = require('fs');

const maxSize = 5 * 1024 * 1024; // 5MB
const uploadsFolder = path.join('src', 'Images');

if (!fs.existsSync(uploadsFolder)) {
    fs.mkdirSync(uploadsFolder, { recursive: true }); // Create directories recursively
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsFolder)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file && !file.originalname.match(/\.(pdf|doc|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only pdf|doc|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF file type are allowed!';
        return cb(new Error('Only pdf|doc|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF file type  are allowed!'), false);
    }
    else {
        cb(null, true);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: maxSize },
})

module.exports = upload