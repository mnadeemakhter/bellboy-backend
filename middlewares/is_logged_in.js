const path = require("path").resolve;
const jsonwebtoken = require('jsonwebtoken')
const config = require(path('config/constants'));

module.exports = async (req, res, next) => {
    try {
        if (req.headers.authorization == "") {
            req._is_logged_in = false;
            next();
        }

        const token = req.headers.authorization.split(" ")[1];
        const decode = jsonwebtoken.verify(token, config.authSecretToken);

        req._is_logged_in = true;
        req._userInfo = {
            _user_id: decode.id || undefined,
            _user_type: decode.type || undefined
        }

        console.log('Authenticated...')
        next();
    } catch (error) {
        req._is_logged_in = false;
        next();
    }
}