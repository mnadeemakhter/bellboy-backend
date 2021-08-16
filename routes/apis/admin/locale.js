const express = require('express')
const router = express.Router();

const LocaleController = require('../../../controllers/admin/locales')

const jwtAuth = require('../../../middlewares/jwt-auth')


router.get('/',jwtAuth, LocaleController.getLocales)
router.post('/',jwtAuth, LocaleController.addLocale)

module.exports = router;