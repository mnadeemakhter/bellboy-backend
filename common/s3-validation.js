const dotenv = require("dotenv");
dotenv.config();
const AWS = require("aws-sdk");
const { v4 } = require("uuid");
const multerS3 = require("multer-s3");
const multer = require("multer");
const messages = require("./messages");
const {
  addVehicleValidationData,
  addVehicleValidationImages,
  addPoliceCertificateValidationData,
} = require("../validation/bellboy");
const apiErrors = require("./api-errors");

AWS.config.update({
  accessKeyId: process.env.AWSACCESSKEY,
  secretAccessKey: process.env.AWSSECRETKEY,
});
const s3 = new AWS.S3();
// const storage = multerS3({
//   s3,
//   bucket: process.env.AWSBUCKET,
//   acl: "public-read",
//   metadata: async function (req, file, cb) {
//     cb(null, { fieldName: file.fieldname, contentType: file.mimetype });
//   },
//   contentType: multerS3.AUTO_CONTENT_TYPE,
//   key: function (req, file, cb) {
//     let path = "";
//     let name = "";
//     if (
//       file.fieldname == "images" ||
//       file.fieldname === "image" ||
//       file.fieldname === "icon" ||
//       file.fieldname === "avatar"
//     ) {
//       path = "public/uploads/" + v4();
//     } else if (file.fieldname == "voiceNote") {
//       path = "public/uploads/voiceNotes/" + v4() + ".m4a";
//     }
//     cb(null, `${path}`);
//   },
// });

exports.upload = (value) => {
  console.log("value [bellboy-multer-validation.js] =>", value);
  let v = 1;
  return multer({
    storage: multerS3({
      s3,
      bucket: process.env.AWSBUCKET,
      acl: "public-read",
      metadata: async function (req, file, cb) {
        // console.log("askjdhasjkh",await Object.entries(file).length);
        // console.log(v ,"=>",file);
        // v++;
        let validationResult;
        switch (value) {
          case "bellboy/add_police_certificate":
            validationResult = addPoliceCertificateValidationData(req.body);
            if (validationResult) {
              return cb({ code: 422, message: validationResult });
            }
            break;
            case "bellboy/vehicle":
              // validationResult = addVehicleValidationImages(req.files);
              // if (validationResult) {
              //   return cb({ code: 422, message: validationResult });
              // }
  
              validationResult = addVehicleValidationData(req.body);
              if (validationResult) {
                return cb({ code: 422, message: validationResult });
              };
              break;

          // if (!data.vehicleType) throw new apiErrors.ValidationError('vehicleType', messages.VEHICLE_TYPE_ID_VALIDATION);

          // default:
          //   return cb(null, {
          //     fieldName: file.fieldname,
          //     contentType: file.mimetype,
          //   });
        }
        cb(null, {
          fieldName: file.fieldname,
          contentType: file.mimetype,
        });
      },
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        let path = "";
        let name = "";
        switch (value) {
          case "bellboy/vehicle":
            path = "public/uploads/vehicle/" + v4();
          default:
            if (
              file.fieldname == "images" ||
              file.fieldname === "image" ||
              file.fieldname === "icon" ||
              file.fieldname === "avatar"
            ) {
              path = "public/uploads/" + v4();
            } else if (file.fieldname == "voiceNote") {
              path = "public/uploads/voiceNotes/" + v4() + ".m4a";
            }
            console.log("path", path);
        }
        return cb(null, `${path}`);
      },
    }),
    limits: { fileSize: 1024 * 1024 * 5 },
  });
};
