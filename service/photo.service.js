// photo.service.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'assets/img/shop'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const storageService = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'assets/img/services'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });
const uploadService = multer({ storage: storageService });

module.exports = { upload , uploadService };