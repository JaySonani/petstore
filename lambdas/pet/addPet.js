const AWS = require('aws-sdk')
const Response = require('./../Response')
const Constants = require('./../Contants')
const Validator = require('./../Validator')

module.exports.handler = async (event) => {

    const body = JSON.parse(event.body)

    const { error } = await Validator.pet.validate(body);

    if (error) {
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
    return Response.createResponse(200, body);
}