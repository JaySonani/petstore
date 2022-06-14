const AWS = require('aws-sdk')
const Log = require('lambda-log')
const Response = require('../../Response')
const Constants = require('../../Constants')
const Validator = require('../../Validator')

module.exports.handler = async (event) => {

    const orderId = event.pathParameters.orderId;

    const { error } = Validator.orderId.validate({ orderId } ?? {});

    if (error) {
        Log.info(Constants.INVALID_INPUT)
        return Response.createResponse(400, {
            message: Constants.INVALID_ID
        })
    }

    const findById = {
        TableName: process.env.DYNAMODB_TABLE_ORDERS,
        IndexName: 'id-index',
        KeyConditionExpression: '#id = :i',
        ExpressionAttributeNames: { "#id": "id" },
        ExpressionAttributeValues: {
            ':i': parseInt(orderId)
        }
    }

    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const res = await dynamoDb.query(findById).promise();

    if (res.Items.length > 0) {
        Log.info("Order found successfully")
        return Response.createResponse(200, res.Items[0])
    } else {
        Log.info(Constants.ORDER_NOT_FOUND)
        return Response.createResponse(404, {
            message: Constants.ORDER_NOT_FOUND
        })
    }

}