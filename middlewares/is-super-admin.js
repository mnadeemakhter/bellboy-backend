const path = require('path').resolve
const jwt = require('jsonwebtoken')
const config = require('../config/constants')
const ReponseService = require(path('common/response'))
const AuthService = require('../services/auth')

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split[" "][1];
        const decoded = jwt.verify(token, config.authSecretToken);

        if (decoded.type != 1) throw new Error();

        req._userInfo = {
            _user_id: decoded.id || undefined,
            _user_type: decoded.type || undefined
        }

        console.log('Authenticated...')
        next()
    }
    catch (e) {
        return res.status(401).send(ReponseService.failure(401));
    }
}