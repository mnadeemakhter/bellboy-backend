const express = require('express')
const router = express.Router();
const path = require('path').resolve;
const DepartmentController = require('../../../controllers/admin/department')

const jwtAuth = require('../../../middlewares/jwt-auth')


router.get('/',jwtAuth, DepartmentController.getDepartments)
router.post('/',jwtAuth, DepartmentController.addDepartment)
router.post('/assignLabel',jwtAuth, DepartmentController.assignLabel)
module.exports = router;