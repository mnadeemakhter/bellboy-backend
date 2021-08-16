class ResponseCodeService {
    getCode(code) {
        const responseObj = [
            {
                code: 200,
                name: "OK",
                description: "All Right",
            },
            {
                code: 201,
                name: "CREATED",
                description: "Resource was created successfully",
            },
            {
                code: 204,
                name: "UPDATED",
                description: "Resource updated successfully",
            },
            {
                code: 400,
                name: "BAD_REQUEST",
                description: "Client Error",
            },
            {
                code: 401,
                name: "UNAUTHORIZED",
                description: "You are not logged in, e.g. using a valid access token",
            },
            {
                code: 403,
                name: "FORBIDDEN",
                description: "You are authenticated but do not have access what you are trying to do",
            },
            {
                code: 404,
                name: "NOT_FOUND",
                description: "The resource you are requesting does not exist",
            },
            {
                code: 405,
                name: "METHOD_NOT_ALLOWED",
                description: "The request type is not allowed.",
            },
            {
                code: 409,
                name: "CONFLICT",
                description: "The resource you are requesting already exists",
            },
            {
                code: 422,
                name: "UNPROCESSABLE_ENTITY",
                description: "Validation failed. The request and the format is valid, however the request was unable to process. For instance when sent data does not pass validation tests",
            },
            {
                code: 500,
                name: "INTERNAL_SERVER_ERROR",
                description: "An error occured on the server which was not the consumer's fault",
            },
        ]

        return responseObj.find((res) => res.code === code);
    }
}

module.exports = new ResponseCodeService();