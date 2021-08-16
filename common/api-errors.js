class ApiError extends Error {
    constructor(message, code) {
        super(message)

        this.name = this.constructor.name

        Error.captureStackTrace(this, this.constructor)

        this.constructor = code || 500
    }
}

class UnAuthorizedError extends ApiError {
    constructor(message, error) {
        let defaultMessage = 'You are not logged in, e.g. using a valid access token'
        super(message || defaultMessage, 401)
        this.error = error || {}
    }
}

class ForbiddenError extends ApiError {
    constructor(message, error) {
        let defaultMessage = 'You are authenticated but do not have access to what you want'
        super(message || defaultMessage, 403)
        this.error = error || {}
    }
}

class NotFoundError extends ApiError {
    constructor(resource, error) {
        let defaultMessage = `The resoure ${resource} you are requesting does not exist`
        super(defaultMessage, 404)
        this.error = error || {}
    }
}

class ResourceAlreadyExistError extends ApiError {
    constructor(field, message) {
        let defaultMessage = `The resoure ${field} you are requesting is already exist`
        super(message || defaultMessage, 409)
        this.error = defaultMessage
    }
}
class ResourceNotFoundError extends ApiError {
    constructor(field, message) {
        let defaultMessage = `The resoure ${field} is not found with this data`
        super(message || defaultMessage, 422)
        this.error = defaultMessage
    }
}

class ValidationError extends ApiError {
    constructor(field, message) {
        let defaultMessage = 'Validation Error. The request and the format is valid, however the request was unable to process. For instance when sent data does not pass validation tests'
        super(message || defaultMessage, 422)
        this.error = { validation: { key: field, message: message } }
    }
}

class InValidIDError extends ApiError {
    constructor(field, message) {
        let defaultMessage = 'Validation Error. The request and the format of ID invalid'
        super(message || defaultMessage, 422)
        this.error = { validation: { key: field, message: message } }
    }
}

class InActiveError extends ApiError {
    constructor(field, message) {
        let defaultMessage = 'The Resource that you are requesting is suspended by the Admins. Sorry for inconvenice'
        super(message || defaultMessage, 422)
        this.error = { validation: { key: field, message: message } }
    }
}

class ModelValidationError extends ApiError {
    // constructor(field, message) {
    //     let defaultMessage = 'Validation Error. The model has some issue, Check the issue of your model'
    //     super(message || defaultMessage, 422)
    //     this.error = { validation: error }
    // }
    constructor(message, error) {
        let defaultMessage = 'An error occured on the server which was not the consumer\s fault'
        super(message || defaultMessage, 422)
        this.error = error || {}
    }
}

class InternalServerError extends ApiError {
    constructor(message, error) {
        let defaultMessage = 'An error occured on the server which was not the consumer\s fault'
        super(message || defaultMessage, 500)
        this.error = error || {}
    }
}

class UnexpectedError extends ApiError {
    constructor(message, error) {
        let defaultMessage = 'Something went wrong'
        super(message || defaultMessage, 500)
        this.error = error || {}
    }
}

module.exports = {
    UnAuthorizedError,
    ForbiddenError,
    NotFoundError,
    ResourceAlreadyExistError,
    ResourceNotFoundError,
    ValidationError,
    ModelValidationError,
    InternalServerError,
    UnexpectedError,
    InActiveError,
    InValidIDError,
}