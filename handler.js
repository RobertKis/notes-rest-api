// 'use strict';
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, UpdateCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
// Initialize DynamoDB client and DocumentClient
const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(client);


const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME;

const send = (statusCode, message) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}

module.exports.createNote = async (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false;
  AWS_NODEJS_CONNECTION_REUSE_ENABLED = 1;
  let data = JSON.parse(event.body);

  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Item: {
        notesId: data.id,
        title: data.title,
        body: data.body
      },
      ConditionExpression: 'attribute_not_exists(notesId)'
    };

    await ddbDocClient.send(new PutCommand(params));
    cb(null, send(201, data));

  }  catch (err) {
    cb(null, send(500, err.message));
  }
};

module.exports.updateNote = async (event, context, cb) => {
  AWS_NODEJS_CONNECTION_REUSE_ENABLED = 1;
  context.callbackWaitsForEmptyEventLoop = false;
  let notesId = event.pathParameters.id
  let data = JSON.parse(event.body);

  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: {
        notesId: notesId
      },
      UpdateExpression: 'set #title = :title, #body = :body',
      ExpressionAttributeNames: {
        '#title': 'title',
        '#body': 'body'
      },
      ExpressionAttributeValues: {
        ':title': data.title,
        ':body': data.body
      },
      ConditionExpression: 'attribute_exists(notesId)'
    };
    
    await ddbDocClient.send(new UpdateCommand(params));
    cb(null, send(200, data));

  } catch (err) {
    cb(null, send(500, err.message));
  }
};

module.exports.deleteNote = async (event, context, cb) => {
  AWS_NODEJS_CONNECTION_REUSE_ENABLED = 1;
  context.callbackWaitsForEmptyEventLoop = false;
  
  let notesId = event.pathParameters.id

  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: {
        notesId: notesId
      },
      ConditionExpression: 'attribute_exists(notesId)'
    };

    await ddbDocClient.send(new DeleteCommand(params));
    cb(null, send(200, notesId));

  } catch (err) {
    cb(null, send(500, err.message));
  }
};

module.exports.getAllNotes = async (event, context, cb) => {
  AWS_NODEJS_CONNECTION_REUSE_ENABLED = 1;
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const params = {
      TableName: NOTES_TABLE_NAME
    };

    const notes = await ddbDocClient.send(new ScanCommand(params));
    return send(200, notes);

  } catch (err) {
    return send(200, notes);
  }
};