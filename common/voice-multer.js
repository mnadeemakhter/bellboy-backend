// const multer = require('multer')
// const path = require('path')

// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, 'public/uploads/voiceNotes');
//     },
//     filename: (req, file, callback) => {

//         let ext = '';

//         if (file.mimetype == 'application/audio')
//             ext = path.extname(file.originalname);

//         console.log(ext)

//         callback(null, Date.now() + '.m4a');
//     }
// })

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
    let path = "public/uploads/voiceNotes";
    cb(null, `${path}.m4a`);
  },
})



module.exports = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
})