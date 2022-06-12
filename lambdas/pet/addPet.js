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

    const newPet = {
        TableName: process.env.DYNAMODB_TABLE_PETS,
        Item: {
            id,
            category,
            name,
            photoUrls,
            tags,
            status,
        }
    }
    try {
        const dynamoDb = new AWS.DynamoDB.DocumentClient();
        await dynamoDb.put(newPet).promise()
        return Response.createResponse(200, body);
    } catch (error) {

        return Response.createResponse(405, {
            message: Constants.INVALID_INPUT,
        })

    }

    // } else {

    //     return Response.createResponse(405, {
    //         message: Constants.INVALID_INPUT,
    //     })

    // }
}