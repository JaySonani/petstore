const AWS = require('aws-sdk')
const Response = require('./../Response')
const Constants = require('./../Contants')

module.exports.handler = async (event) => {

    // TODO: Validate id with Joi
    const petId = event.pathParameters.petId;

    if (!isNaN(petId)) {

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

    } else {

        return Response.createResponse(400, {
            message: Constants.INVALID_ID
        })

    }
}