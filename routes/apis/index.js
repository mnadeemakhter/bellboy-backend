const express = require('express')
const router = express.Router();

// const upload=require("../../common/s3-validation")
// let Upload= upload.upload("bellboy/vehicle")
const adminRoutes = require('./admin')
const customerRoutes = require('./customers')
const bellBoyRoutes = require('./bellboy')

router.use('/admin',adminRoutes)
router.use('/customer',customerRoutes)
router.use('/bellboy',bellBoyRoutes)
// router.post("/img-test",Upload.single("photo"),async (req,res)=>{
//     try {
//         console.log(req.file);
//         return res.status(200).json({msg:"working"});
//     } catch (error) {
//         console.log("[img-test] error =>",error);
//         return res.status(200).json({msg:"error"});
//     }
// })


module.exports = router;