const express = require('express')
const router = express.Router();
const HiringActionTypeController = require('../../../controllers/customer/hiring-action-type')

router.get('/', HiringActionTypeController.getHiringActionTypes)
module.exports = router;