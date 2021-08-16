const messages = require("../common/messages");

exports.addVehicleValidationImages = (files) => {
  // console.log("addVehicleValidationImages [files]",files["back_image"])
  console.log("files [addVehicleValidationImages]", files);
  if (!files["front_image"]) return messages.FRONT_IMAGE_VALIDATION;
  if (!files["back_image"]) return messages.BACK_IMAGE_VALIDATION;
  if (!files["left_image"]) return messages.LEFT_IMAGE_VALIDATION;
  if (!files["right_image"]) return messages.RIGHT_IMAGE_VALIDATION;
  if (!files["plate_image"]) return messages.PLATE_IMAGE_VALIDATION;
  return null;
};
exports.addVehicleValidationData = (data) => {
  if (!data.vehicleType) return messages.VEHICLE_TYPE_ID_VALIDATION;
  if (!data.vehicleBrand) return messages.VEHICLE_BRAND_ID_VALIDATION;
  if (!data.vehicleModel) return messages.VEHICLE_BRAND_ID_VALIDATION;
  if (!data.color) return messages.COLOR_VALIDATION;
  if (!data.engine_no) return messages.VEHICLE_ENGINE_NO_VALIDATION;
  if (!data.registration_year)
    return messages.VEHICLE_REGISTRATION_YEAR_VALIDATION;
  if (!data.owner) return messages.VEHICLE_OWNER_NAME;
  return null;
};
exports.addPoliceCertificateValidationData=(data)=>{
  console.log("[addPoliceCertificateValidationData]=> ",data)
  if(!data.date_of_issue) return "date of issue required";
  if(!data.character_certificate_no) return "character certificate requried";
  return null
}
