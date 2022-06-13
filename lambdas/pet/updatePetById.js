const AWS = require('aws-sdk')
const Response = require('./../Response')
const Constants = require('./../Contants')
const Validator = require('./../Validator')


module.exports.handler = async (event) => {

    const body = JSON.parse(event.body)

    const { error } = await Validator.updatingPet.validate(body);

    if (error) {
        return Response.createResponse(405, {
            message: Constants.INVALID_INPUT,
        })
    }

    const petId = event.pathParameters.petId;
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const updatedPet = {
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

    await dynamoDb.update(updatedPet).promise()

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
    return Response.createResponse(200, finalRes.Items[0]);

}