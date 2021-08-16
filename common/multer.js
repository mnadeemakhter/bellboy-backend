// const multer = require('multer')
// const path = require('path')

// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {

//         if (file.fieldname == 'images' ||
//         file.fieldname === "image" ||file.fieldname === "icon" ||
//         file.fieldname === "avatar" ) {
//             callback(null, 'public/uploads');
//         }
//         else if (file.fieldname == 'voiceNote') {
//             callback(null, 'public/uploads/voiceNotes');
//         }
//     },
//     filename: (req, file, callback) => {

//         if (file.fieldname == 'images' ||
//         file.fieldname === "image" || file.fieldname === "icon" ||
//         file.fieldname === "avatar" ) {
//             let ext = '';
//             ext = path.extname(file.originalname);

//             console.log(ext)

//             callback(null, Date.now() + '.png');



//         }



//         else if (file.fieldname == 'voiceNote') {
//             let ext = '';
//             ext = path.extname(file.originalname);

//             console.log(ext)

//             callback(null, Date.now() + '.m4a');


//         }

//     },
// })

// function checkFileType(file, cb) {
//     if (file.fieldname === "voiceNote") {
//         if (
//             file.mimetype === 'audio/m4a' ||
//             file.mimetype === 'audio/mp3' ||
//             file.mimetype === 'audio/mp4' ||
//             file.mimetype === 'audio/aac'
//         ) { // check file type to be pdf, doc, or docx
//             cb(null, true);
//         } else {
//             cb(null, false); // else fails
//         }
//     }
//     else if (file.fieldname === "images" ||
//         file.fieldname === "image" ||file.fieldname === "icon" ||
//         file.fieldname === "avatar" ) {
//         if (
//             file.mimetype === 'image/png' ||
//             file.mimetype === 'image/jpg' ||
//             file.mimetype === 'image/jpeg' ||
//             file.mimetype === 'image/gif'
//         ) { // check file type to be png, jpeg, or jpg
//             cb(null, true);
//         } else {
//             cb(null, false); // else fails
//         }
//     }
// }




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
    else if (file.fieldname == 'notificationImg') {
      path="public/notifications/"+ v4() + file.mimetype.split("/")[1];
    }
    cb(null, `${path}`);
  },
})

module.exports = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
})

