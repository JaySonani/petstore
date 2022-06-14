const AWS = require('aws-sdk')
const Log = require('lambda-log')
const Response = require('../../Response')
const Constants = require('../../Constants')
const Validator = require('../../Validator')

module.exports.handler = async (event) => {

    const body = JSON.parse(event.body)

    const { error } = Validator.updatingPet.validate(body);

    if (error) {
        Log.info(Constants.INVALID_INPUT)
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
    Log.info("Pet updated successfully")
    return Response.createResponse(200, finalRes.Items[0]);

}