const AdminService = require('./admin')
const CustomerService = require('./customer')
const BellBoyService = require('./bell-boy')
class AuthService {
    async getUser(request, type) {
        switch (type) {
            case 1:
                return AdminService.getAdmin(request);
            case 2:
                return BellBoyService.getBellboy(request);
            case 3:
                return CustomerService.getCustomer(request);
            default:
                return null;
        }
    }

    async createUser(request, type) {
        switch (type) {
            case 1:
                return AdminService.createAdmin(request);
            case 2:
                return BellBoyService.createBellboy(request);
            case 3:
                return CustomerService.createCustomer(request);
            default:
                return null;
        }
    }
    async updateUser(request, criteria, type) {
        switch (type) {
            case 1:
                return AdminService.updateAdmin(request, criteria);
            case 2:
                return BellBoyService.updateBellboy(request, criteria);
            case 3:
                return CustomerService.updateCustomer(request, criteria);
            default:
                return null;
        }
    }
}

module.exports = new AuthService();