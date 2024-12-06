const multer = require('multer');
const multerConfig = require('./multerConfig');
const s3Storage = require('./s3Storage');

const upload = multer({
  ...multerConfig,
  storage: s3Storage
});

module.exports = upload;