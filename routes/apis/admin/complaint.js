const express = require('express')
const router = express.Router()

const ComplaintController = require('../../../controllers/admin/complaint')


const jwtAuth = require('../../../middlewares/jwt-auth')

router.get('/',jwtAuth,ComplaintController.getComplaints);
router.delete('/:complaint_id',jwtAuth,ComplaintController.deleteComplain);
router.post('/',jwtAuth,ComplaintController.addComplaint);


module.exports = router;