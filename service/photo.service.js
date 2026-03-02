const fs = require('fs');
const multer = require('multer');
const path = require('path');

const uploadRoot = process.env.UPLOAD_ROOT || path.join(__dirname, '..', 'assets');
const shopUploadDir = path.join(uploadRoot, 'img', 'shop');
const serviceUploadDir = path.join(uploadRoot, 'img', 'services');

function ensureUploadDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadDir(shopUploadDir);
    cb(null, shopUploadDir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${path.basename(file.originalname)}`)
});

const storageService = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadDir(serviceUploadDir);
    cb(null, serviceUploadDir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${path.basename(file.originalname)}`)
});

const upload = multer({ storage });
const uploadService = multer({ storage: storageService });

module.exports = { upload , uploadService };
