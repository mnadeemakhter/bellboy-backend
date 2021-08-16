const express = require('express')
const router = express.Router()
const AuthController = require('../../../controllers/common/auth')
const jwtAuth = require('../../../middlewares/jwt-auth')
const path = require('path').resolve;


//BellBoy Multer
const Upload = require(path('common/bellboy-multer'))
router.post('/login', AuthController.bellBoyLogin.bind(AuthController))
router.post('/register', Upload.single('avatar'), AuthController.register.bind(AuthController),)

router.post('/logout', jwtAuth, AuthController.logout.bind(AuthController))
// usman only for uploading avatar
router.post('/avatar', Upload.single('avatar'), (req,res,next)=>{
    try {
        const data={}
        // data.image = req.file.destination + '/' + req.file.filename;
        data.image = req.file.key;
        console.log(req.file)
        return res.status(200).json({file:req.file,data})
    } catch (error) {
        
    }
})
module.exports = router;