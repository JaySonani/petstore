const AWS = require('aws-sdk')
const Responses = require('./Responses')

module.exports.handler = async (event) => {

    const body = JSON.parse(event.body)
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    let response;


    if (body.id && body.category && body.photoURL && body.tags && body.status) {
        const updatedPet = {
            TableName: process.env.DYNAMODB_TABLE_PETS,
            Key: {
                id: body.id
            },
            // ExpressionAttributeNames: {
            //     'category': 'category',
            //     'photoURL': 'photoURL',
            //     'tags': 'tags',
            //     'status': 'status',
            // },
            UpdateExpression: "set category = :c",
            // UpdateExpression: "set category = :c, photoURL = :p, tags = :t, status = :s",

            ExpressionAttributeValues: {
                ":c": body.category,
                // ":p": body.photoURL,
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