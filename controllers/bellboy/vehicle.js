const BellBoyService = require('../../services/bell-boy')
const VehicleTypeService = require('../../services/vehicle-type')
const VehicleBrandService = require('../../services/vehicle-brands')
const VehicleModelService = require('../../services/vehicle-model')
const VehicleService = require('../../services/vehicle')
const ResponseService = require('../../common/response')
const apiErrors = require('../../common/api-errors')
const messages = require('../../common/messages')
const LocalizationService = require('../../common/localization')
const LocaleService = require('../../services/locales')
const { addVehicleValidationData } = require('../../validation/bellboy')

class BellBoyVehicleController {
    async getAllVehicleTypes(req, res) {
        try {
            let countData = await VehicleTypeService.VehicleTypeTotalCount();
            let fetchedData = await VehicleTypeService.getVehicleTypes();

            let code = req.query.locale || 'en';
            let locale = await LocaleService.getLocale({ code: code });

            if (!locale) return res.status(200).send(ResponseService.success({}, 'Invalid Locale Code', false));


            fetchedData = LocalizationService.getLabels(fetchedData, code);


            let response = { count: countData, vData: fetchedData };

            res.send(ResponseService.success(response));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
    async getAllVehicleBrands(req, res) {
        try {
            let data = Object.assign({}, req.query);
            if (!data.vehicleType) throw new apiErrors.ValidationError('vehicleType', messages.VEHICLE_TYPE_ID_VALIDATION);

            let checkData = await VehicleTypeService.getVehicleType({ _id: data.vehicleType });
            if (!checkData) throw new apiErrors.ResourceNotFoundError('vehicleType', messages.INVALID_ID_VALIDATION);
            let fetchedData = [];
            fetchedData = await VehicleBrandService.getOnlyVehicleBrands({ vehicleTypes: { $in: [data.vehicleType] } });
            let countData = fetchedData.length;



            let code = req.query.locale || 'en';
            let locale = await LocaleService.getLocale({ code: code });

            if (!locale) return res.status(200).send(ResponseService.success({}, 'Invalid Locale Code', false));


            fetchedData = LocalizationService.getLabels(fetchedData, code);

            let response = { count: countData, vData: fetchedData };

            res.send(ResponseService.success(response));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
    async getAllVehicleModels(req, res) {
        try {
            let data = Object.assign({}, req.query);
            if (!data.vehicleType) throw new apiErrors.ValidationError('vehicleType', messages.VEHICLE_TYPE_ID_VALIDATION);
            if (!data.vehicleBrand) throw new apiErrors.ValidationError('vehicleBrand', messages.VEHICLE_BRAND_ID_VALIDATION);

            let checkData = null;

            checkData = await VehicleTypeService.getVehicleType({ _id: data.vehicleType });
            if (!checkData) throw new apiErrors.ResourceNotFoundError('vehicleType', messages.INVALID_ID_VALIDATION);

            checkData = await VehicleBrandService.getVehicleBrand({ _id: data.vehicleBrand });
            if (!checkData) throw new apiErrors.ResourceNotFoundError('vehicleBrand', messages.INVALID_ID_VALIDATION);


            let fetchedData = [];
            fetchedData = await VehicleModelService.getOnlyVehicleModels({ vehicleType: data.vehicleType, vehicleBrand: data.vehicleBrand });
            let countData = fetchedData.length;


            let code = req.query.locale || 'en';
            let locale = await LocaleService.getLocale({ code: code });

            if (!locale) return res.status(200).send(ResponseService.success({}, 'Invalid Locale Code', false));


            fetchedData = LocalizationService.getLabels(fetchedData, code);

            let response = { count: countData, vData: fetchedData };

            res.send(ResponseService.success(response));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
    async addVehicle(req, res,next) {
        try {
            let user_id = req._user_info._user_id;
            const data=req.body;
            // console.log("req.body [main]",req.body,user_id);
            // console.log("req.files [main]",req.files);

            let validationResult = addVehicleValidationData(req.body);
            console.log("validationResult",validationResult)
            if (validationResult) {
              return next({ code: 422, message: validationResult });
            }
            let vehicleType = await VehicleTypeService.getVehicleType({ _id: data.vehicleType });
            if (!vehicleType) throw new apiErrors.ResourceNotFoundError();

            let vehicleBrand = await VehicleBrandService.getVehicleBrand({ _id: data.vehicleBrand });
            if (!vehicleBrand) throw new apiErrors.ResourceNotFoundError();

            let vehicleModel = await VehicleModelService.getVehicleModel({ _id: data.vehicleModel });
            if (!vehicleModel) throw new apiErrors.ResourceNotFoundError();

            if (!req.files['front_image']) throw new apiErrors.ValidationError('front_image', messages.FRONT_IMAGE_VALIDATION)
            if (!req.files['back_image']) throw new apiErrors.ValidationError('back_image', messages.BACK_IMAGE_VALIDATION)
            if (!req.files['left_image']) throw new apiErrors.ValidationError('left_image', messages.LEFT_IMAGE_VALIDATION)
            if (!req.files['right_image']) throw new apiErrors.ValidationError('right_image', messages.RIGHT_IMAGE_VALIDATION)

            if (!req.files['vehicle_reg_front_image']) throw new apiErrors.ValidationError('vehicle_reg_front_image', messages.REGISTRATION_FRONT_IMAGE_VALIDATION)
            if (!req.files['vehicle_reg_back_image']) throw new apiErrors.ValidationError('vehicle_reg_back_image', messages.REGISTRATION_BACK_IMAGE_VALIDATION)


            let front_image = req.files.front_image[0];
            let back_image = req.files.back_image[0];
            let left_image = req.files.left_image[0];
            let right_image = req.files.right_image[0];

            let vehicle_images = {};
            const vehicle_reg_images={};
            let reg_right_image = req.files.vehicle_reg_front_image[0];
            let ref_back_image = req.files.vehicle_reg_back_image[0];

            vehicle_reg_images.front_image=reg_right_image.key;
            vehicle_reg_images.back_image=ref_back_image.key;
            if(req.files['vehicle_reg_back_image']){
                vehicle_reg_images.other_image=req.files.vehicle_reg_other_image[0].key
            }

            vehicle_images.front_image = front_image.key;
            vehicle_images.back_image = back_image.key;
            vehicle_images.left_image = left_image.key;
            vehicle_images.right_image = right_image.key;

            data.vehicle_images = vehicle_images;
            data.vehicle_reg_images=vehicle_reg_images;


            let plate_image = null;
            if (!data.plate_number) throw new apiErrors.ValidationError('plate_number', messages.PLATE_NUMBER_VALIDATION);
            if (!req.files['plate_image']) throw new apiErrors.ValidationError('plate_image', messages.PLATE_IMAGE_VALIDATION)
            plate_image = req.files.plate_image[0];

            let checkPlateNumber = await VehicleService.getVehicle({ 'plate.plate_number': data.plate_number });
            if (checkPlateNumber) throw new apiErrors.ResourceAlreadyExistError('plate_number', messages.RESOURCE_ALREADY_EXISTS);
            let plate = {};
            plate.plate_image = plate_image.key;
            plate.plate_number = data.plate_number;

            data.plate = plate;


            data.bellboy = user_id;

            let newData = await VehicleService.addVehicle(data);

            res.send(ResponseService.success(newData));
        } catch (error) {
            console.log("error",error)
            res.send(ResponseService.failure(error));
        }
    }
    async getVehicles(req, res) {
        try {
            let user_id = req._user_info._user_id;

            let fetchedData = [];
            fetchedData = await VehicleService.getVehicles({ bellboy: user_id });
            let countData = fetchedData.length;

            let response = { count: countData, vData: fetchedData };

            res.send(ResponseService.success(response));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
    async getVehicleDetail(req, res) {
        try {
            let user_id = req._user_info._user_id;
            let data = Object.assign({},req.query);
            let fetchedData = [];
            fetchedData = await VehicleService.getVehicleForBellBoy({ bellboy: user_id,_id:data.vehicle_id });
          

           

            res.send(ResponseService.success(fetchedData));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
}

module.exports = new BellBoyVehicleController();