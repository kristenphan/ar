import {DynamoDBClient, QueryCommand} from "@aws-sdk/client-dynamodb";
let response;

export const handler = async (event) => {
    // Extract params from event
    const body = JSON.parse(event.body);
    const sensorId = body.sensorId;
    
    // Create a DynamoDBClient which auto marshalls JSON-like params to DynamoDB JSON
    const ddbClient = new DynamoDBClient({region: "eu-central-1"});
    
    const params = {
        TableName: "webar-ddb-sensordata",
        ExpressionAttributeValues: {
            ":sensorId": {"N": sensorId},
        },
        KeyConditionExpression: "sensorId = :sensorId", // sensorId = partition key
        ScanIndexForward: false, // timestamp = sort key: False = sort from newest to oldest
        Limit: 1 // Show n item
    };
    
    // Run query. Lambda is given IAM role to access Dynamodb table
    try {
        const data = await ddbClient.send(new QueryCommand(params));
        const sensorValue = data.Items[0].sensorValue["N"]; 
        const timestamp = data.Items[0].timestamp["N"];
        console.log("Command success!");
        console.log("data.Items = ", data.Items);
        response = {
            "statusCode": 200,
            "body": JSON.stringify({
                sensorValue: sensorValue,
                timestamp: timestamp
            })
        }
        
    } catch (err) {
        console.log("error = ", err);
        return err;
    }
    return response;
};