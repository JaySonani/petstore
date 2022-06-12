const AWS = require('aws-sdk')
const Responses = require('./Responses')

module.exports.handler = async (event) => {

    const body = JSON.parse(event.body)
    const petId = event.pathParameters.petId;

    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    let response;


    if (body.name !== undefined && body.status !== undefined) {


        const params = {
            TableName: process.env.DYNAMODB_TABLE_PETS,
            Key: {
                "id": parseInt(petId)
            },
            UpdateExpression: "set #name = :n, #status = :s",
            ExpressionAttributeNames: {
                "#name": "name",
                "#status": "status"
            },
            ExpressionAttributeValues: {
                ":n": body.name,
                ":s": body.status
            }
        };

        const res = await dynamoDb.update(params).promise()


        const findById = {
            TableName: process.env.DYNAMODB_TABLE_PETS,
            IndexName: 'id-index',
            KeyConditionExpression: '#id = :i',
            ExpressionAttributeNames: { "#id": "id" },
            ExpressionAttributeValues: {
                ':i': parseInt(petId)
            }
        }

        const finalRes = await dynamoDb.query(findById).promise();
        response = Responses.createResponse(200, finalRes.Items)

    } else {
        response = Responses.createResponse(405, {
            message: "Invalid input"
        })
    }

    return response;
}