const AWS = require('aws-sdk')
const Response = require('../../Response')
const Constants = require('../../Constants')
const Validator = require('../../Validator')

module.exports.handler = async (event) => {

    const petId = event.pathParameters.petId;

    const { error } = Validator.petId.validate({ petId } ?? {});

    if (error) {
        return Response.createResponse(405, {
            message: Constants.INVALID_INPUT,
        })
    }

    let itemToBeDeleted = {
        Key: {
            id: parseInt(petId),
        },
        TableName: process.env.DYNAMODB_TABLE_PETS,
        ReturnValues: 'ALL_OLD'
    };

    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const res = await dynamoDb.delete(itemToBeDeleted).promise();

    if (res.Attributes !== undefined) {
        return Response.createResponse(200, {
            message: "Pet deleted successfully",
        })
    } else {
        return Response.createResponse(404, {
            message: Constants.PET_NOT_FOUND
        })
    }
}