const express = require('express')
const router = express.Router()
const path = require('path').resolve

const DashboardController = require('../../../controllers/admin/dashboard')

const Upload = require(path('common/multer'))

const jwtAuth = require('../../../middlewares/jwt-auth')

router.get('/',jwtAuth,DashboardController.getDashboard);
router.get('/days_records',jwtAuth,DashboardController.getDashboardDaysRecords);
router.get("/totalRecords",jwtAuth,DashboardController.getTotalRecords)
router.get("/graphdata",jwtAuth,DashboardController.getDashboardGraphData)
router.get("/detailsData",jwtAuth,DashboardController.getDashboardDetailsData)

module.exports = router;