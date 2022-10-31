import {DynamoDBClient, QueryCommand} from "@aws-sdk/client-dynamodb";

export const handler = async (event) => {
    // Create a DynamoDBClient which auto marshalls JSON-like params to DynamoDB JSON
    const ddbClient = new DynamoDBClient({region: "eu-central-1"});
    
    const params = {
        TableName: "webar-ddb-wateringhistory",
        KeyConditionExpression: "plantId = :plantId",
        ExpressionAttributeValues: {
            ":plantId": {"N": "1"},
        },
        ScanIndexForward: false, // Sort by sort key "timestamp": False = newest to oldest
        Limit: 3, // Show 3 items
    };
    
    // Run query. Lambda is given IAM role to access Dynamodb table
    try {
        const data = await ddbClient.send(new QueryCommand(params));
        console.log("Command success!");
        console.log("data.Items = ", data.Items);
    } catch (err) {
        console.log("error = ", err);
    }
};