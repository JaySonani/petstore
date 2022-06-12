const AWS = require('aws-sdk')
const Responses = require('./Responses')

module.exports.handler = async (event) => {
    const body = JSON.parse(event.body)
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    let response;

    if (body.id !== undefined && body.petId !== undefined && body.quantity !== undefined && body.shipDate !== undefined && body.complete !== undefined) {

        const newOrder = {
            TableName: process.env.DYNAMODB_TABLE_ORDERS,
            Item: {
                id: body.id,
                petId: body.petId,
                quantity: body.quantity,
                shipDate: body.shipDate,
                status: body.status,
                complete: body.complete,
            }
        }
        await dynamoDb.put(newPet).promise()
        response = Responses.createResponse(200, body);
    } else {
        response = Responses.createResponse(405, {
            message: "Invalid input",
        })
    }
    return response;
}