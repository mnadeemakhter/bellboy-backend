const express = require('express')
const router = express.Router()
const path = require('path').resolve

const AdminCustomerController = require('../../../controllers/admin/customer')
const CustomerController = require('../../../controllers/customer/user')


const Upload = require(path('common/multer'))

const jwtAuth = require('../../../middlewares/jwt-auth')

router.get('/',jwtAuth,AdminCustomerController.getCustomers);
router.get('/:customer',jwtAuth,AdminCustomerController.getCustomer);
router.post('/',jwtAuth,AdminCustomerController.addCustomer);
router.put('/',jwtAuth,AdminCustomerController.updateCustomer);


module.exports = router;