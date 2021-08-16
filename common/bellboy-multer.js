
// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, 'public/uploads/bellboy');
//     },
//     filename: (req, file, callback) => {

//         let ext = '';

//         if (file.mimetype == 'application/image')
//             ext = path.extname(file.originalname);

//         console.log(ext)

//         callback(null, Date.now() + '.png');
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
    let path = "public/uploads/bellboy/" +v4()+`.${file.mimetype.split("/")[1]}`;
    cb(null, `${path}`);
  },
})



module.exports = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
})