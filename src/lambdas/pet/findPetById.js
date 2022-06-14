const AWS = require('aws-sdk')
const Log = require('lambda-log')
const Response = require('../../Response')
const Constants = require('../../Constants')
const Validator = require('../../Validator')

module.exports.handler = async (event) => {

    const petId = event.pathParameters.petId;

    const { error } = Validator.petId.validate({ petId } ?? {});

    if (error) {
        Log.info(Constants.INVALID_INPUT)
        return Response.createResponse(400, {
            message: Constants.INVALID_ID,
        })
    }

    const findById = {
        TableName: process.env.DYNAMODB_TABLE_PETS,
        IndexName: 'id-index',
        KeyConditionExpression: '#id = :i',
        ExpressionAttributeNames: { "#id": "id" },
        ExpressionAttributeValues: {
            ':i': parseInt(petId)
        }
    }

    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const res = await dynamoDb.query(findById).promise();

    if (res.Items.length > 0) {
        Log.info("Pet found successfully")
        return Response.createResponse(200, res.Items)
    }
    else {
        Log.info("Pet not found")
        return Response.createResponse(404, {
            message: Constants.PET_NOT_FOUND
        })
    }
}