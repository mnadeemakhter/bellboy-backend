const ResponseService = require('../../common/response')
const apiErrors = require('../../common/api-errors')
const messages = require('../../common/messages')
const CustomerService = require('../../services/customer')
const mongoose = require('mongoose')

class AddressController {

    async getAddresses(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let customer = await CustomerService.getCustomer({ _id: user_id })
            if (!customer) throw new apiErrors.ResourceNotFoundError()
            if (customer.addresses.length == 0) return res.send(ResponseService.success([],'No address found ',false));
            return res.send(ResponseService.success(customer.addresses));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async addAddress(req, res) {
        try {

            const user_id = req._user_info._user_id;

            var data = Object.assign({}, req.body);

            if (!data.title) throw new apiErrors.ValidationError('title', messages.TITLE_VALIDATION);
            if (!data.contact_number) throw new apiErrors.ValidationError('contact_number', messages.CONTACT_NUMBER_VALIDATION);
            if (!data.address) throw new apiErrors.ValidationError('address', messages.ADDRESS_VALIDATION);
            if (!data.latitude) throw new apiErrors.ValidationError('latitude', messages.LATITUDE_VALIDATION);
            if (!data.longitude) throw new apiErrors.ValidationError('longitude', messages.LONGITUDE_VALIDATION);

            let address = {
                title: data.title,
                contact_number: data.contact_number,
                address: data.address,
                geolocation: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                }
            }

            var customer = await CustomerService.getCustomer({ _id: user_id });
            if (!customer) throw new apiErrors.NotFoundError();



            customer.addresses.push(address);
            let updatedCustomer = await customer.save();




            return res.send(ResponseService.success(updatedCustomer));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async removeAddress(req, res) {
        try {

            let data = Object.assign({}, req.body);
            if (!data.address) throw new apiErrors.ValidationError('address', messages.ADDRESS_VALIDATION);
            const user_id = req._user_info._user_id;
            let customer = await CustomerService.getCustomer({ _id: user_id })
            if (!customer) throw new apiErrors.ResourceNotFoundError()
            if (customer.addresses.length == 0) throw new apiErrors.ResourceNotFoundError();
            customer = await CustomerService.updateCustomer({ $pull: { 'addresses': { _id: new mongoose.Types.ObjectId(data.address) } } }, { _id: user_id, });
            return res.send(ResponseService.success(customer.addresses));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
}

module.exports = new AddressController();