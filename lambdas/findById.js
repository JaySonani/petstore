const AWS = require('aws-sdk')
const Responses = require('./Responses')


module.exports.handler = async (event) => {

    let response;

    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const petId = event.pathParameters.petId;
    if (!isNaN(petId)) {
        const findById = {
            TableName: process.env.DYNAMODB_TABLE_PETS,
            IndexName: 'id-index',
            KeyConditionExpression: '#id = :i',
            ExpressionAttributeNames: { "#id": "id" },
            ExpressionAttributeValues: {
                ':i': parseInt(petId)
            }
        }

        const res = await dynamoDb.query(findById).promise();
        if (res.Items.length > 0)
            response = Responses.createResponse(200, res.Items)
        else
            response = Responses.createResponse(404, {
                message: "Pet not found"
            })


    } else {
        response = Responses.createResponse(400, {
            message: "Invalid ID supplied"
        })
    }

    return response;
}