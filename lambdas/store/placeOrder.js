const AWS = require('aws-sdk')
const Response = require('./../Response')
const Constants = require('./../Contants')

module.exports.handler = async (event) => {

    const body = JSON.parse(event.body)

    for (let item in Constants.ORDER_PROPERTIES) {
        if (!(Constants.ORDER_PROPERTIES[item] in body)) {
            return Response.createResponse(400, {
                message: Constants.INVALID_ORDER,
            })
        }
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