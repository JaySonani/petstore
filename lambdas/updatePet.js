const AWS = require('aws-sdk')
const Responses = require('./Responses')

module.exports.handler = async (event) => {

    const body = JSON.parse(event.body)
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    let response;


    if (body.id !== undefined && body.category !== undefined && body.name !== undefined && body.photoUrls !== undefined && body.tags !== undefined && body.status !== undefined) {
        const updatedPet = {
            TableName: process.env.DYNAMODB_TABLE_PETS,
            Key: {
                id: body.id
            },
            // ExpressionAttributeNames: {
            //     'category': 'category',
            //     'photoUrls': 'photoUrls',
            //     'tags': 'tags',
            //     'status': 'status',
            // },
            UpdateExpression: "set category = :c",
            // UpdateExpression: "set category = :c, name = :n, photoUrls = :p, tags = :t, status = :s",

            ExpressionAttributeValues: {
                ":c": body.category,
                // ":n": body.name,
                // ":p": body.photoUrls,
                // ":t": body.tags,
                // ":s": body.status
            }
        }
        await dynamoDb.update(updatedPet).promise().then(
            async (res) => {
                response = Responses.createResponse(200, body);
                return response;
            }, (error) => {
                response = Responses.createResponse(400, {
                    message: error
                })
                return response;
            }
        )

    } else {
        response = Responses.createResponse(405, {
            message: "Invalid input"
        })
    }

    return response;
}