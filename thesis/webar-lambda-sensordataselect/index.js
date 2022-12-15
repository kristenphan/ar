import {DynamoDBClient, QueryCommand} from "@aws-sdk/client-dynamodb";

export const handler = async (event) => {
    // Create a DynamoDBClient which auto marshalls JSON-like params to DynamoDB JSON
    const ddbClient = new DynamoDBClient({region: "eu-central-1"});
    
    const params = {
        TableName: "webar-ddb-plantId.1.sensordata",
        ExpressionAttributeValues: {
            ":sensorId": {"N": "1"},
        },
        KeyConditionExpression: "sensorId = :sensorId", // sensorId = partition key
        ScanIndexForward: false, // timestamp = sort key: False = sort from newest to oldest
        Limit: 1 // Show n item
    };
    
    // Run query. Lambda is given IAM role to access Dynamodb table
    try {
        const data = await ddbClient.send(new QueryCommand(params));
        console.log("Command success!");
        console.log("data.Items = ", data.Items);
        console.log("data = ", data);
    } catch (err) {
        console.log("error = ", err);
    }
};