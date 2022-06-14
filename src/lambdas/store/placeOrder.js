const AWS = require('aws-sdk')
const Response = require('../../Response')
const Constants = require('../../Constants')
const Validator = require('../../Validator')

module.exports.handler = async (event) => {

    const body = JSON.parse(event.body)

    const { error } = Validator.order.validate(body);

    if (error) {
        return Response.createResponse(400, {
            message: Constants.INVALID_ORDER,
        })
    }

    const { id, petId, quantity, shipDate, status, complete } = body;

    const newOrder = {
        TableName: process.env.DYNAMODB_TABLE_ORDERS,
        Item: { id, petId, quantity, shipDate, status, complete }
    }

    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    await dynamoDb.put(newOrder).promise()
    return Response.createResponse(200, body);
}