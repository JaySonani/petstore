const AWS = require('aws-sdk')
const Log = require('lambda-log')
const Response = require('../../Response')
const Constants = require('../../Constants')
const Validator = require('../../Validator')

module.exports.handler = async (event) => {

    const { error } = Validator.status.validate(event.queryStringParameters ?? {});

    if (error) {
        Log.info(Constants.INVALID_INPUT)
        return Response.createResponse(400, {
            message: Constants.STATUS_IS_REQUIRED,
        });
    }

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
    Log.info("Pet found successfully")
    return Response.createResponse(200, res.Items || []);
}