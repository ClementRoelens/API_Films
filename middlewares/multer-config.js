const multer = require('multer');
const fs = require('fs');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        console.log("Multer storage.destination");
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        console.log("Multer storage.filename");
        const name = req.body.titre.split(' ').join('_');
        const finalName = name + Date.now() + '.' +  MIME_TYPES[file.mimetype];
        callback(null, finalName);
    }
});

module.exports = multer({ storage: storage }).single('file');