const AWS = require('aws-sdk')
const Responses = require('./Responses')

module.exports.handler = async (event) => {
    let response;

    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const petId = event.pathParameters.petId;

    if (!isNaN(petId)) {

        let itemToBeDeleted = {
            Key: {
                id: parseInt(petId),
            },
            TableName: process.env.DYNAMODB_TABLE_PETS
        };
        await dynamoDb.delete(itemToBeDeleted, (err, data) => {

            if (err) {
                response = Responses.createResponse(404, {
                    message: "Pet not found"
                })

            } else {
                //  always going here
                response = Responses.createResponse(200, {
                    message: "Pet deleted successfully"
                })
            }

        }).promise();


    } else {
        response = Responses.createResponse(400, {
            message: "Invalid ID supplied"
        })
    }


    return response;
}