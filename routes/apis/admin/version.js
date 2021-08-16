const {addNewVersion,getListVersion,getSingleVersion,activateNewVersion,deActivateVersion}=require("../../../controllers/admin/version");
const express = require('express')
const router = express.Router()
const jwtAuth = require('../../../middlewares/jwt-auth')

router.post('/',jwtAuth,addNewVersion);

router.get("/",jwtAuth,getListVersion)
router.get("/:id",jwtAuth,getSingleVersion)
router.put("/activate/:id",activateNewVersion)
router.put("/deactivate/:id",deActivateVersion)




module.exports = router;



