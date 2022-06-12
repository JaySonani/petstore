const AWS = require('aws-sdk')
const Responses = require('./Responses')


module.exports.handler = async (event) => {

    let response;

    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    if (event.queryStringParameters !== undefined && event.queryStringParameters.status !== undefined) {

        const status = event.queryStringParameters.status;

        const findByStatus = {
            TableName: process.env.DYNAMODB_TABLE_PETS,
            IndexName: 'status-index',
            KeyConditionExpression: '#status = :s',
            ExpressionAttributeNames: { "#status": "status" },
            ExpressionAttributeValues: {
                ':s': status
            }
        }

        const res = await dynamoDb.query(findByStatus).promise();
        response = Responses.createResponse(200, res.Items || [])

        // response = Responses.createResponse(200, {
        //     "ha": "moj"
        // })


    } else {
        response = Responses.createResponse(400, {
            message: "Status is required"
        })

    }



    return response;
}