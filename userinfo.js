
const { dynamoClient, docClient } = require("./connection");

const TABLE_NAME = "UsersInfo";

const getUsers = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  const questions = await dynamoClient.scan(params).promise();
  return questions;
};

const getUserById = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: id,
    },
  };
  return await dynamoClient.get(params).promise();
};



const addUser = async (userinfo) => {
  const params = {
    TableName: TABLE_NAME,
    Item: userinfo,
  };
  return await dynamoClient.put(params).promise();
};

const updateUser = async (user) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: user.id,
    },
    UpdateExpression:
      "set fullName = :fullName, password = :password, rolePosition = :rolePosition",
    ExpressionAttributeValues: {
      ":fullName": user.fullName,
      ":password": user.password,
      ":rolePosition": user.rolePosition,
    },
  };
  return await dynamoClient.update(params).promise();
};

const deleteUser = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: id,
    },
  };
  return await dynamoClient.delete(params).promise();
};

module.exports = {
 getUsers,
 getUserById,
 addUser,
 updateUser,
 deleteUser,
 
};