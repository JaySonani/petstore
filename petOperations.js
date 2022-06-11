"use strict"
const AWS = require('aws-sdk')

module.exports.addPet = async (event) => {
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

        response = {
            statusCode: 200,
            body: JSON.stringify(body, null, 2)
        };
    } else {
        response = {
            statusCode: 405,
            body: JSON.stringify({
                "message": "Invalid input"
            })
        }
    }
    return response;
}

module.exports.updatePet = async (event) => {

    const body = JSON.parse(event.body)
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    let response;


    if (body.id && body.category && body.photoURL && body.tags && body.status) {
        const updatedPet = {
            TableName: process.env.DYNAMODB_TABLE_PETS,
            // Item: {
            //     id: body.id,
            //     category: body.category,
            //     photoURL: body.photoURL,
            //     tags: body.tags,
            //     status: body.status,
            // }
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
                response = {
                    statusCode: 200,
                    body: JSON.stringify(body, null, 2)
                };
                return response;
            }, (error) => {
                response = {
                    statusCode: 400,
                    body: {
                        message: error,
                    }
                }
                return response;
            }
        )

    } else {
        response = {
            statusCode: 405,
            body: JSON.stringify({
                "message": "Invalid input"
            })
        }
    }

    return response;
}