const Responses = {
    createResponse(statusCode = 200, data = {}) {
        return {
            statusCode: statusCode,
            body: JSON.stringify(data, null, 2)
        }
    }
}

module.exports = Responses;