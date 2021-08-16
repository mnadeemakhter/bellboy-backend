const ChargesService = require('./../../services/charges')
const ResponseService = require('./../../common/response')
const HelperService = require('./../../common/helper')
const DatabaseService = require('./../../common/push-notification')
const BellBoyTypeService = require('./../../services/bellboy-type')
//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')

class ChargesController {

    async manageCharge(req, res) {
        try {
            let data = Object.assign({}, req.body);

            if (!data.value) throw new apiErrors.ValidationError('title', messages.VALUE_VALIDATION)
            if (!data.service_type) throw new apiErrors.ValidationError('service_type', messages.SERVICE_TYPE_VALIDATION)
            if (!data.charges_type) throw new apiErrors.ValidationError('charges_type', messages.CHARGES_TYPE_VALIDATION)
            if (!data.bellboy_type) throw new apiErrors.ValidationError('bellboy_type', messages.BELLBOY_TYPE_VALIDATION)


            if (data.value < 0.01) throw new apiErrors.ValidationError('value', ' Value cannot be zero or less than zero')


            let checkID = await HelperService.isValidMongoID(data.bellboy_type);

            if (!checkID) throw new apiErrors.InValidIDError('bellboy_type');

            let bellboy_type = await BellBoyTypeService.getBellBoyType({ _id: data.bellboy_type });

            if (!bellboy_type) throw new apiErrors.ResourceNotFoundError('bellboy_type', 'No BellBoy-Type is registered with this ID');

            let criteria = { service_type: data.service_type, charges_type: data.charges_type, bellboy_type: data.bellboy_type, status: true };

            let charge = await ChargesService.getCharge(criteria);

            if (charge) {
                charge.status = false;
                charge = await charge.save();
                charge = await ChargesService.addCharges(data);
            }
            else {


                charge = await ChargesService.addCharges(data);
            }

            charge = await ChargesService.getCharge(criteria);

            return res.status(200).send(ResponseService.success(charge))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getCharges(req, res) {
        try {
            let data = Object.assign({}, req.query);
            if (!data.service_type) throw new apiErrors.ValidationError('service_type', messages.SERVICE_TYPE_VALIDATION)
            console.log(data.service_type)
            let charges = await ChargesService.aggregateCharges(parseInt(data.service_type))

            //   if(charges.length==0)return res.status(200).send(ResponseService.success({},'No Charges found against this service_type'))

            return res.status(200).send(ResponseService.success(charges))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async getAllCharges(req, res) {
        try {
            let data = Object.assign({}, req.query);
            let charges = await ChargesService.getCharges(data);

            //   if(charges.length==0)return res.status(200).send(ResponseService.success({},'No Charges found against this service_type'))

            return res.status(200).send(ResponseService.success(charges))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async getD(req, res) {
        try {
            let data = Object.assign({}, req.query);
            let records = await DatabaseService.getRecords(data.order_id);
           


            return res.status(200).send(ResponseService.success({ records }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }


}

module.exports = new ChargesController();