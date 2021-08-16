const express = require('express')
const router = express.Router()
const AuthController = require('../../../controllers/common/auth')

router.post('/register', AuthController.register.bind(AuthController))
router.post('/login', AuthController.login.bind(AuthController))

module.exports = router;