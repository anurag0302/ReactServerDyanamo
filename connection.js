const AWS = require("aws-sdk");
require("dotenv").config();
AWS.config.update({
  region: "ap-south-1",
  endpoint: "http://localhost:8000",
  credentials: {
    accessKeyId: 'fakeMyKeyId',
    secretAccessKey: 'fakeSecretAccessKey'
  }
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
var docClient = new AWS.DynamoDB();

module.exports = {
  dynamoClient,
  docClient
};
