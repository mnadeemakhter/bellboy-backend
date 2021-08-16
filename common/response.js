const ResponseCodeService = require('./response-code')

class ResponseService {

    success(data = {},message='OK',success = true) {
        console.table([{ data: data }]);

        return {
            success: success,
            code: 200,
            data: data,
            message:message
        }

    }

    failure(e,data = {}) {

        console.table([{ code: e.code, name: e.name, message: e.message }])

        return {
            success: false,
            code: ResponseCodeService.getCode(e.code)||500,
            message: e.message ? e.message.replace(/\s+$/g, '.') : e.message,
          //  error: e.error || e,
            data:data
        }

    }

}

module.exports = new ResponseService();