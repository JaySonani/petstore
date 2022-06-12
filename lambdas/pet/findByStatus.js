const AWS = require('aws-sdk')
const Response = require('./../Response')
const Constants = require('./../Contants')

module.exports.handler = async (event) => {

    if (event.queryStringParameters !== undefined && event.queryStringParameters.status !== undefined) {

        const dynamoDb = new AWS.DynamoDB.DocumentClient();
        const status = event.queryStringParameters.status;

        const findByStatus = {
            TableName: process.env.DYNAMODB_TABLE_PETS,
            IndexName: 'status-index',
            KeyConditionExpression: '#status = :s',
            ExpressionAttributeNames: { "#status": "status" },
            ExpressionAttributeValues: {
                ':s': status
            }
        }

        const res = await dynamoDb.query(findByStatus).promise();
        return Response.createResponse(200, res.Items || []);

    } else {

        return Response.createResponse(400, {
            message: Constants.STATUS_IS_REQUIRED
        });

    }
}