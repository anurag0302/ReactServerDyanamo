const elasticsearch = require("@elastic/elasticsearch");
const { createConnector } = require("aws-elasticsearch-js");

const region = "ap-south-1";
const domain = "http://localhost:8000";

const client = new elasticsearch.Client({
  nodes: [domain],
  Connection: createConnector({ region }),
});

const { dynamoClient, docClient } = require("./connection");

const TABLE_NAME = "QuestionAnswer";
const getQuestions = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  const questions = await dynamoClient.scan(params).promise();
  return questions;
};

const getQuestionById = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      questionId: id,
    },
  };
  return await dynamoClient.get(params).promise();
};

//Api for searching
const getSearchResult = async (data) => {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "contains(qa, :qa)  ",
    //FilterExpression: "question in (:q )  ",
    ExpressionAttributeValues: {
      ":qa": { S: data },
      //":a": { S:  data},
    },
  };

  return await docClient.scan(params).promise();
};

const addOrUpdateQuestion = async (question) => {
  const params = {
    TableName: TABLE_NAME,
    Item: question,
  };
  return await dynamoClient.put(params).promise();
};
const updateQuestion = async (question) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      questionId: question.id,
    },
    UpdateExpression: "set question = :q, answer = :a, qa = :qa",
    ExpressionAttributeValues: {
      ":q": question.question,
      ":a": question.answer,
      ":qa": question.question.toLowerCase() +" "+question.answer.toLowerCase(),
    },
  };
  return await dynamoClient.update(params).promise();
};

const deleteQuestion = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      questionId: id,
    },
  };
  return await dynamoClient.delete(params).promise();
};

module.exports = {
  dynamoClient,
  getQuestions,
  getQuestionById,
  addOrUpdateQuestion,
  getSearchResult,
  deleteQuestion,
  updateQuestion
};
