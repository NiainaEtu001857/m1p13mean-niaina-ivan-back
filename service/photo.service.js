const fs = require('fs');
const multer = require('multer');
const path = require('path');

const uploadRoot = process.env.UPLOAD_ROOT || path.join(__dirname, '..', 'assets');
const shopUploadDir = path.join(uploadRoot, 'img', 'shop');
const serviceUploadDir = path.join(uploadRoot, 'img', 'services');

function ensureUploadDir(dirPath) {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
    return null;
  } catch (err) {
    return err;
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dirError = ensureUploadDir(shopUploadDir);
    if (dirError) return cb(dirError);
    cb(null, shopUploadDir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${path.basename(file.originalname)}`)
});

const storageService = multer.diskStorage({
  destination: (req, file, cb) => {
    const dirError = ensureUploadDir(serviceUploadDir);
    if (dirError) return cb(dirError);
    cb(null, serviceUploadDir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${path.basename(file.originalname)}`)
});

const upload = multer({ storage });
const uploadService = multer({ storage: storageService });

module.exports = { upload , uploadService };
