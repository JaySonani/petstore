const AWS = require('aws-sdk')
const Response = require('../../Response')
const Constants = require('../../Constants')
const Validator = require('../../Validator')

module.exports.handler = async (event) => {

    const orderId = event.pathParameters.orderId;

    const { error } = Validator.orderId.validate({ orderId } ?? {});

    if (error) {
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

    if (res.Items.length > 0)
        return Response.createResponse(200, res.Items[0])
    else
        return Response.createResponse(404, {
            message: Constants.ORDER_NOT_FOUND
        })

}