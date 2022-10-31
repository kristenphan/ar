import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";

export const handler = async (event) => {
    // Create a DynamoDBClient which auto marshalls JSON-like params to DynamoDB JSON
    const ddbClient = new DynamoDBClient({region: "eu-central-1"});
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
    
    // Create params of PutCommand ie., putItem()
    const params = {
        TableName: "webar-ddb-wateringhistory",
        Item: {
            "plantId": 1, // partition key type NUMBER
            "timestamp": Date.now(), // sort key NUMBER
            "plantStatus": "Not good" // 
          }
    };
    
    // Run query. Lambda is given IAM role to access Dynamodb table
    try {
        const data = await ddbDocClient.send(new PutCommand(params));
        console.log("PutCommand success!");
        console.log("data = ", data);
    } catch (err) {
        console.log("error = ", err.stack);
    }
};