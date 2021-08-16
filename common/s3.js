const dotenv = require("dotenv");
dotenv.config();
const AWS = require("aws-sdk");
const { v4 } = require("uuid");
const multerS3 = require("multer-s3");
const multer = require("multer");
AWS.config.update({
  accessKeyId: process.env.AWSACCESSKEY,
  secretAccessKey: process.env.AWSSECRETKEY,
});
const s3 = new AWS.S3();
const storage=multerS3({
  s3,
  bucket: process.env.AWSBUCKET,
  acl: "public-read",
  metadata: async function (req, file, cb) {
    cb(null, { fieldName: file.fieldname, contentType: file.mimetype });
  },
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: function (req, file, cb) {
    let path = "";
    let name = "";
    if (file.fieldname == 'images' ||
    file.fieldname === "image" ||file.fieldname === "icon" ||
    file.fieldname === "avatar" ) {
      path="public/uploads/"+v4();
    }
    else if (file.fieldname == 'voiceNote') {
      path="public/uploads/voiceNotes/"+ v4() + '.m4a';
    }
    cb(null, `${path}`);
  },
})

module.exports = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
})

