const ResponseService = require('../../common/response')
const apiErrors = require('../../common/api-errors')
const messages = require('../../common/messages')
const CustomerService = require('../../services/customer')


class UserController {

    async getProfile(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let customer = await CustomerService.getCustomer({ _id: user_id })
            if (!customer) throw new apiErrors.ResourceNotFoundError()

            return res.send(ResponseService.success(customer));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async updateProfile(req, res) {
        try {
            const user_id = req._user_info._user_id;


            let data = Object.assign({}, req.body);

            let customer;
            let checkCustomer;

            customer = await CustomerService.getCustomer({ _id: user_id });

            if (data.mobile) {
                checkCustomer = await CustomerService.getCustomer({ _id: { $ne: user_id }, mobile: data.mobile });
                if (checkCustomer) throw new apiErrors.ResourceAlreadyExistError('customer', 'Another Customer Already exists with this mobile')

            }
            if (data.email) {
                checkCustomer = await CustomerService.getCustomer({ _id: { $ne: user_id }, email: data.email });
                if (checkCustomer) throw new apiErrors.ResourceAlreadyExistError('customer', 'Another Customer Already exists with this email')

            }
            let avatar;
            if (req.file) {
                // avatar = req.file.destination + '/' + req.file.filename;
                avatar = req.file.key;
                
                data.avatar = {
                    value: avatar,
                    exists: true
                }
            }
            customer = await CustomerService.updateCustomer(data, { _id: user_id },);

            if (!customer) throw new apiErrors.ResourceNotFoundError()

            return res.send(ResponseService.success(customer));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async registerToken(req, res) {
        try {
            let user_id = req._user_info._user_id;
            let data = Object.assign({}, req.body)

            let customer = await CustomerService.getCustomer({ _id: user_id });
            if (!customer) throw new apiErrors.NotFoundError('bellboy');

            customer.fcm_token = data.fcm_token;
            customer = await customer.save();
            res.send(ResponseService.success(customer))
        } catch (error) {
            res.send(ResponseService.failure(error))
        }
    }

}

module.exports = new UserController();