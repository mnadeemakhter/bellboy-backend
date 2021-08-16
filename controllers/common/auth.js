const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const path = require('path').resolve
const config = require(path('config/constants'))
const uuidv4 = require('uuid/v4')
const rp = require('request-promise')

const apiError = require('../../common/api-errors')
const messages = require('../../common/messages')
const AuthService = require('../../services/auth')
const ResponseService = require('../../common/response')
const AdminService = require('../../services/admin')
const CustomerService = require('../../services/customer')
const BellBoyService = require('../../services/bell-boy')
var admin = require("firebase-admin");

class AuthController {
    async login(req, res) {
        try {
            let request = Object.assign({}, req.body);
            let type = this.getUserType(req.baseUrl);
            console.log('User Type', messages.arrowHead, type)
            // console.log('Request Data', messages.arrowHead, request)
            if (!request.email) throw new apiError.ValidationError('email', messages.EMAIL_VALIDATION);
            request.email = request.email.toLowerCase()

            let user;

            if (!request.password) throw new apiError.ValidationError('password', messages.PASSWORD_VALIDATION)
            if (type == 1) {
                let email = request.email;
                user = await AuthService.getUser({ email: email }, type);
                if (!user) throw new apiError.UnAuthorizedError(messages.CREDIENTIALS_MISMATCH)
                if (user && !user.status) throw new apiError.UnAuthorizedError(messages.USER_BLOCK)

                let matchPassword = await bcrypt.compare(request.password, user.password);
                if (!matchPassword) throw new apiError.UnAuthorizedError(messages.CREDIENTIALS_MISMATCH)
            }




            let token = await this.getJwtAuthToken(user, type)

            let obj = {}

            if (request.fcm_token)
                user.fcm_token = request.fcm_token;
            if (type == 2 || type == 3)
                user.is_logged = true;
            if (type != 1) {
                user.auth_token = token;
            }

            let updateUser = await AuthService.updateUser(user, { _id: user._id }, type);
            console.log('User Updation' + messages.arrowHead, updateUser)
            if (!updateUser) throw new apiError.InternalServerError();
            user.password = null;

            let response = {
                token,
                user,
                // isFirebaseUser:firebaseUser.email?true:false
            }
            admin
                .auth()
                .getUserByEmail(request.email)
                .then((userRecord) => {
                // See the UserRecord reference doc for the contents of userRecord.
                console.log(`Successfully fetched user data: ${userRecord.toJSON().email}`);
            return res.status(200).send(ResponseService.success({...response,isFirebaseUser:true}))

             })
            .catch((error) => {
            return res.status(200).send(ResponseService.success({...response,isFirebaseUser:false}))
            });
        }
        catch (e) {
            return res.status(e.code || 500).send(ResponseService.failure(e))
        }
    }
    async register(req, res) {
        try {
            let type = this.getUserType(req.baseUrl);
            console.log('User Type', messages.arrowHead, type)
            let data = Object.assign({}, req.body);

            console.log('Request Data', messages.arrowHead, data)

            if (!data.email) throw new apiError.ValidationError('email', messages.EMAIL_VALIDATION)

            data.email = data.email.toLowerCase();

            let token;
            let response;
            let updateUser;



            if (type == 1) {
                if (!data.password) throw new apiError.ValidationError('password', messages.PASSWORD_VALIDATION)

                let newAdmin;


                let admin = await AdminService.getAdmin({ email: data.email });
                console.log('Request Data', messages.arrowHead, admin)
                if (admin) throw new apiError.ResourceAlreadyExistError('email', messages.EMAIL_ALREADY_EXISTS)

                var salt = await bcrypt.genSaltSync(10)
                var hash = await bcrypt.hashSync(data.password, salt)

                if (!hash) throw errorHandler.InternalServerError()

                data.password = hash

                if (!data.role) throw new apiError.ValidationError('role required', messages.ROLE_ID_REQUIRED)



                newAdmin = await AuthService.createUser(data, type);
                let token = await this.getJwtAuthToken(newAdmin, type)
                if (!newAdmin) throw new apiError.UnexpectedError();
                return res.status(200).send(ResponseService.success({ admin: newAdmin, token: token }))
            }
            else if (type == 2) {
                console.log(data)
                if (!data.mobile) throw new apiError.ValidationError('mobile', messages.MOBILE_VALIDATION)
                if (!data.name) throw new apiError.ValidationError('name', messages.NAME_VALIDATION)
                if (!data.dob_d) throw new apiError.ValidationError('birth day', messages.DAY_VALIDATION)
                if (!data.dob_m) throw new apiError.ValidationError('birth month', messages.MONTH_VALIDATION)
                if (!data.dob_y) throw new apiError.ValidationError('birth year', messages.YEAR_VALIDATION)
                if (!req.file) throw new apiError.ResourceNotFoundError('avatar', messages.IMAGE_VALIDATION)
                if (!data.cnic) throw new apiError.ValidationError('cnic', messages.NIC_NUMBER_VALIDATION)
                let nicLength = data.cnic.toString().length;
                console.log(nicLength);
                if (!(nicLength > 1 && nicLength < 14)) return res.status(200).send(ResponseService.success({}, messages.NIC_LENGTH_VALIDATION))
                let nic = data.cnic;
                data.legals = {
                    nic: {
                        value: nic
                    }
                };
                // let avatar = req.file.destination + '/' + req.file.filename;
                let avatar = req.file.key;

                data.avatar = {
                    value: avatar,
                    // usman s3 integeration
                    // value:req.file.location,
                    exists: true
                }
                //  if (!data.gender) throw new apiError.ValidationError('gender', messages.GENDER_VALIDATION)

                // data.gender = data.gender.toLowerCase();
                let dob_d = data.dob_d;
                let dob_m = data.dob_m;
                let dob_y = data.dob_y;
                data.birth_date = {
                    day: dob_d,
                    month: dob_m,
                    year: dob_y,
                }

                console.log(data)

                let newBellBoy;

                if (data.mobile) {
                    let dupBellBoy = await BellBoyService.getBellboy({ mobile: data.mobile });
                    if (dupBellBoy)
                        return res.status(200).send(ResponseService.success({}, messages.RESOURCE_ALREADY_EXISTS + ' Mobile', false))

                }

                if (data.email) {
                    let dupBellBoy = await BellBoyService.getBellboy({ email: data.email });
                    if (dupBellBoy) return res.status(200).send(ResponseService.success({}, messages.RESOURCE_ALREADY_EXISTS + ' Email', false))
                }
                if (data.cnic) {
                    let dupBellBoy = await BellBoyService.getBellboy({ 'legals.nic.value': data.cnic });
                    if (dupBellBoy) return res.status(200).send(ResponseService.success({}, messages.RESOURCE_ALREADY_EXISTS + ' CNIC', false))
                }

                newBellBoy = await AuthService.createUser(data, type);
                if (!newBellBoy) throw new apiError.UnexpectedError();
                token = this.getJwtAuthToken(newBellBoy, type)
                if (data.fcm_token)
                    newBellBoy.fcm_token = data.fcm_token;
                newBellBoy.is_logged = true;
                newBellBoy.auth_token = token;
                updateUser = await AuthService.updateUser(newBellBoy, { _id: newBellBoy._id }, type);

                return res.status(200).send(ResponseService.success(updateUser))


            }

            return null;

        }
        catch (e) {
            return res.status(500).send(ResponseService.failure(e))
        }
    }



    async customerLogin(req, res) {
        try {
            let type = this.getUserType(req.baseUrl);
        if (!type == 3) throw new apiError.UnexpectedError();

        console.log('User Type', messages.arrowHead, type)
        let request = Object.assign({}, req.body);
        console.log('Request Data', messages.arrowHead, request)
        if (!request.mobile) throw new apiError.ValidationError('mobile', messages.MOBILE_VALIDATION)
        let customerData = await CustomerService.getCustomer({ 'mobile': request.mobile });
        const { device } = req;
        let newCustomer;
        let token;
        let response;
        let customer;
        if (!customerData) {
            newCustomer = await AuthService.createUser(request, type);
            if (!newCustomer) throw new apiError.UnexpectedError();
            console.log('New Customer', messages.arrowHead, newCustomer)
            token = await this.getJwtAuthToken(newCustomer, type)
            if (request.fcm_token)
                newCustomer.fcm_token = request.fcm_token;
            newCustomer.is_logged = true;
            newCustomer.auth_token = token;

            if (device.os.name === "Android") {
                newCustomer.current_device = 1;
                newCustomer.signup_device = 1;
            }
            else if (device.os.name === "iOS") {
                newCustomer.current_device = 2;
                newCustomer.signup_device = 2;
            }
            else {
                newCustomer.current_device = 0;
                newCustomer.signup_device = 0;
            }
            newCustomer.last_active = Date.now();

            customer = await AuthService.updateUser(newCustomer, { _id: newCustomer._id }, type);

        }
        else {
            console.log('Customer Data', messages.arrowHead, customer)
            token = await this.getJwtAuthToken(customerData, type)


            if (request.fcm_token)
                customerData.fcm_token = request.fcm_token;
            customerData.is_logged = true;
            customerData.auth_token = token;
            customerData.total_logins = customerData.total_logins + 1;
            if (device.os.name === "Android") {
                customerData.current_device = 1;
            }
            else if (device.os.name === "iOS") {
                customerData.current_device = 2;
            }
            else {
                customerData.current_device = 0;
            }
            customerData.last_active = Date.now();

            customer = await AuthService.updateUser(customerData, { _id: customerData._id }, type);
        }

        console.log('User Updation' + messages.arrowHead, customer)
        if (!customer) throw new apiError.InternalServerError();

        response = {
            token,
            customer
        }
        return res.status(200).send(ResponseService.success(response))
        } catch (e) {
            return res.status(e.code || 500).send(ResponseService.failure(e))
            
        }
    }

    async bellBoyLogin(req, res) {
        try {
            let type = this.getUserType(req.baseUrl);
            console.log(type);
            if (!type == 2) throw new apiError.UnexpectedError();

            console.log('User Type', messages.arrowHead, type)
            let request = Object.assign({}, req.body);

            console.log('Request Data', messages.arrowHead, request)
            if (!request.mobile) throw new apiError.ValidationError('mobile', messages.MOBILE_VALIDATION)
            let bellBoy = await BellBoyService.getBellboy({ 'mobile': request.mobile });
            let token;
            let udpateBellBoy;
            if (!bellBoy) return res.status(200).send(ResponseService.success({}, 'BellBoy not registered with this number ' + request.mobile, false))
            else {

                //     if (bellBoy.is_logged) return res.status(200).send(ResponseService.success({}, 'You are already logged into another device', false))
                console.log('Bellboy Data', messages.arrowHead, bellBoy)
                token = await this.getJwtAuthToken(bellBoy, type)


                if (request.fcm_token)
                    bellBoy.fcm_token = request.fcm_token;
                bellBoy.is_logged = true;
                bellBoy.auth_token = token;
                udpateBellBoy = await AuthService.updateUser(bellBoy, { _id: bellBoy._id }, type);
            }

            console.log('User Updation' + messages.arrowHead, udpateBellBoy)
            if (!udpateBellBoy) throw new apiError.InternalServerError();


            return res.status(200).send(ResponseService.success(udpateBellBoy))
        } catch (e) {
            return res.status(e.code || 500).send(ResponseService.failure(e))
        }

    }

    async logout(req, res) {
        try {
            const user_id = req._user_info._user_id;
            const type = this.getUserType(req.baseUrl);
            console.log(user_id);
            let user = await AuthService.getUser({ _id: user_id }, type);
            if (!user) throw new apiError.ValidationError('token', messages.AUTHENTICATION_ERROR);

            let updateUser;
            let request;
            if (type == 2) {
                request = { is_logged: false, working_status: false, $unset: { auth_token: 1 } };
            }
            else {
                request = { is_logged: false, $unset: { auth_token: 1 } }
            }
            updateUser = await AuthService.updateUser(request, { _id: user_id }, type);
            if (!updateUser) throw new apiError.InternalServerError();
            res.send(ResponseService.success({ user: updateUser }));
        } catch (error) {

        }
    }

    getJwtAuthToken(user, type) {
        let jwtTokenArgs = {
            id: user._id,
            type: type,
        }
        return jwt.sign(jwtTokenArgs, config.authSecretToken)
    }
    getUserType(url) {
        let type = url.split('/')[2];

        switch (type) {
            case 'admin':
                return 1;
            case 'bellboy':
                return 2;
            case 'customer':
                return 3;
            default:
                return 0;
        }
    }

}

module.exports = new AuthController();
