const express = require('express')
const router = express.Router();

const RoleController = require('../../../controllers/admin/role')

const jwtAuth = require('../../../middlewares/jwt-auth')



router.get('/',RoleController.getRoles)
router.get('/:role',jwtAuth,RoleController.getRole)
router.post('/',jwtAuth,RoleController.addRole)
router.put('/',jwtAuth,RoleController.updateRole)
module.exports = router;