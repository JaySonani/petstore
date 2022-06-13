const AWS = require('aws-sdk')
const Response = require('./../Response')
const Contants = require('./../Contants')

module.exports.handler = async (event) => {

    const orderId = event.pathParameters.orderId;

    if (!isNaN(orderId)) {

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
                message: Contants.ORDER_NOT_FOUND
            })

    } else {

        return Response.createResponse(400, {
            message: Contants.INVALID_ID
        })

    }
}