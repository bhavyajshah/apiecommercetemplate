const multerS3 = require('multer-s3');
const path = require('path');
const initializeAWS = require('../aws');

const s3 = initializeAWS();

const s3Storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME,
  acl: 'public-read',
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `templates/${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

module.exports = s3Storage;