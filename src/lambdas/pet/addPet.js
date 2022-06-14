const AWS = require('aws-sdk')
const Log = require('lambda-log')
const Response = require('../../Response')
const Constants = require('../../Constants')
const Validator = require('../../Validator')

module.exports.handler = async (event) => {

    const body = JSON.parse(event.body)

    const { error } = Validator.pet.validate(body);

    if (error) {
        Log.info(Constants.INVALID_INPUT)
        return Response.createResponse(405, {
            message: Constants.INVALID_INPUT,
        })
    }
    const { id, category, name, photoUrls, tags, status } = body;

    const newPet = {
        TableName: process.env.DYNAMODB_TABLE_PETS,
        Item: { id, category, name, photoUrls, tags, status }
    }

    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    await dynamoDb.put(newPet).promise()
    Log.info("Pet added successfully")

    return Response.createResponse(200, body);
}