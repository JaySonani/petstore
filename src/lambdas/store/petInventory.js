const AWS = require('aws-sdk')
const Response = require('../../Response')

module.exports.handler = async (event) => {

    const getAllItems = {
        TableName: process.env.DYNAMODB_TABLE_PETS,
    }

    let allItems = [];
    let items;
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    do {
        items = await dynamoDb.scan(getAllItems).promise();
        items.Items.forEach((item) => allItems.push(item));
        getAllItems.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey !== "undefined");

    let allStatus = []
    allItems.forEach((item) => allStatus.push(item.status))

    const uniqueStatus = [...new Set(allStatus)];

    let response = {}
    for (let status in uniqueStatus) {
        response[uniqueStatus[status]] = 0
    }

    for (let status in uniqueStatus) {
        for (let item in allItems) {
            if (allItems[item]["status"] === uniqueStatus[status])
                response[uniqueStatus[status]] += 1
        }
    }

    return Response.createResponse(200, response);
}