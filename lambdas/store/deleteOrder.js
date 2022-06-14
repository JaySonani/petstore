const AWS = require('aws-sdk')
const Response = require('./../Response')
const Constants = require('./../Contants')
const Validator = require('./../Validator')

module.exports.handler = async (event) => {

    const orderId = event.pathParameters.orderId;

    const { error } = Validator.orderId.validate({ orderId } ?? {});

    if (error) {
        return Response.createResponse(400, {
            message: Constants.INVALID_ID
        })
    }

    let itemToBeDeleted = {
        Key: {
            id: parseInt(orderId),
        },
        TableName: process.env.DYNAMODB_TABLE_ORDERS,
        ReturnValues: 'ALL_OLD'
    };

    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const res = await dynamoDb.delete(itemToBeDeleted).promise();

    if (res.Attributes !== undefined) {
        return Response.createResponse(200, {
            message: "Order deleted successfully",
        })
    } else {
        return Response.createResponse(404, {
            message: Constants.ORDER_NOT_FOUND
        })
    }
}