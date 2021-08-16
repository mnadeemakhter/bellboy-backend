const express = require('express');
const router = express.Router();

const AuthRoutes = require('./auth')
const UserRoutes = require('./user')
const VehicleRoutes = require('./vehicle')
const OrderRoutes = require('./order')
const HiringRoutes = require('./hiring')
const BellBoyTypeRoutes = require('./bellboy-type')
const DashboardRoutes = require('./dashboard')
const Becomebellboy = require("./becomeBellboy");
const versionRoutes = require("./version");
router.use('/auth', AuthRoutes)
router.use('/user', UserRoutes)
router.use('/vehicle', VehicleRoutes)

// this order api is not used 
router.use('/order', OrderRoutes)

// this api is used for hiring purpose
router.use('/hiring', HiringRoutes)
router.use('/bellboy-type', BellBoyTypeRoutes)
router.use('/dashboard', DashboardRoutes)
router.use("/becomebellboy", Becomebellboy)
router.use("/version",versionRoutes)
//router.use('/',isSuperAdmin,AdminUserRoutes)

module.exports = router; 