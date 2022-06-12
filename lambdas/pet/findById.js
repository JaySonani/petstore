const AWS = require('aws-sdk')
const Response = require('./../Response')
const Contants = require('./../Contants')

module.exports.handler = async (event) => {

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

        const dynamoDb = new AWS.DynamoDB.DocumentClient();
        const res = await dynamoDb.query(findById).promise();

        if (res.Items.length > 0)
            return Response.createResponse(200, res.Items)
        else
            return Response.createResponse(404, {
                message: Contants.PET_NOT_FOUND
            })

    } else {

        return Response.createResponse(400, {
            message: Contants.INVALID_ID
        })

    }
}