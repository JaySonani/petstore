const AWS = require('aws-sdk')
const Responses = require('./Responses')

module.exports.handler = async (event) => {
    const body = JSON.parse(event.body)
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    let response;

    if (body.id && body.category && body.photoURL && body.tags && body.status) {
        const newPet = {
            TableName: process.env.DYNAMODB_TABLE_PETS,
            Item: {
                id: body.id,
                category: body.category,
                photoURL: body.photoURL,
                tags: body.tags,
                status: body.status,
            }
        }
        await dynamoDb.put(newPet).promise()
        response = Responses.createResponse(200, body);
    } else {
        response = Responses.createResponse(405, {
            message: "Invalid input"
        })
    }
    return response;
}