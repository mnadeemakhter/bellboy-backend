const express = require('express');
const router = express.Router();

const AuthRoutes = require('./auth')
const CartRoutes = require('./cart')
const OrderRoutes = require('./order')
const HiringRoutes = require('./hiring')
const AddressRoutes = require('./address')
const CategoryRoutes = require('./category')
const ProfileRoutes = require('./user')
const ProductRoutes = require('./product')
const WalletTypesRoutes = require('./wallet-type')
const ComplaintRoutes = require('./complaint')
const HiringActionTypeRoutes = require('./hiring-action-type')
const HiringCartRoutes = require('./hiring-cart')
const BellBoyTypeRoutes = require('./bellboy-type')
const HomeRoutes = require('./home')
const WalletRoutes = require('./wallet')
const NotificationRoute = require('./notification')
const versionRoutes = require('./version')


router.use('/auth',AuthRoutes)
router.use('/cart',CartRoutes)
router.use('/order',OrderRoutes)
router.use('/hiring',HiringRoutes)
router.use('/category',CategoryRoutes)
router.use('/address',AddressRoutes)
router.use('/',ProfileRoutes)
router.use('/product',ProductRoutes)
router.use('/wallet-type',WalletTypesRoutes)
router.use('/complaint',ComplaintRoutes)
router.use('/hiring-action-type',HiringActionTypeRoutes)
router.use('/hiring-cart',HiringCartRoutes)
router.use('/bellboy-type',BellBoyTypeRoutes)
router.use('/home',HomeRoutes)
router.use('/wallet',WalletRoutes)
router.use("/notification", NotificationRoute)
router.use("/version",versionRoutes)


//router.use('/',isSuperAdmin,AdminUserRoutes)

module.exports = router; 