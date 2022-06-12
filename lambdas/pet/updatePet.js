const AWS = require('aws-sdk')
const Response = require('./../Response')
const Constants = require('./../Contants')

module.exports.handler = async (event) => {

    const body = JSON.parse(event.body)

    for (let item in Constants.PET_PROPERTIES) {
        if (!(Constants.PET_PROPERTIES[item] in body)) {
            return Response.createResponse(405, {
                message: Constants.INVALID_INPUT,
            })
        }
    }

    const { id, category, name, photoUrls, tags, status } = body;

    const updatedPet = {
        TableName: process.env.DYNAMODB_TABLE_PETS,
        Key: {
            id: id
        },
        UpdateExpression: "set #category = :c, #name = :n, #photoUrls = :p, #tags = :t, #status = :s",
        ExpressionAttributeNames: {
            '#category': 'category',
            '#name': 'name',
            '#photoUrls': 'photoUrls',
            '#tags': 'tags',
            '#status': 'status',
        },
        ExpressionAttributeValues: {
            ":c": category,
            ":n": name,
            ":p": photoUrls,
            ":t": tags,
            ":s": status
        }
    }

    try {
        const dynamoDb = new AWS.DynamoDB.DocumentClient();
        await dynamoDb.update(updatedPet).promise();
        return Response.createResponse(200, body);
    } catch (errorr) {
        return Response.createResponse(400, {
            message: Constants.INVALID_ID,
        })
    }
}