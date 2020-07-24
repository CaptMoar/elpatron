'use strict';

const http = require('serverless-http');
const express = require('express');
const aws = require('aws-sdk');
const bodyParser = require('body-parser');
const { response } = require('express');

const app = express();
const docClient = new aws.DynamoDB();
const tableName = process.env.tableName

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send(`yi boi`)
});

app.post('/resumen', (req, res) => {
  var params = {
    TableName: 'ssff-informe-resumen',
    Limit: 20,
  }

  docClient.scan(params, async (err, result) => {
    if (err) {
      console.log(`[ERR] ${err}`)
    } else {
      const { items } = await result
      res.json({
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },  
        body: result
      });
    }
  });
});

app.post('/auditoria', (req, res) => {
  var params = {
    KeyConditionExpression: 'id_audio = :id_audio',
    ExpressionAttributeValues: {
        ':id_audio': {'S': '2020_07_10_13901774_9'}
    },
    TableName: "ssff-informe" 
  }

  docClient.query(params, async (err, result) => {
    if (err) {
      console.log(`[ERR] ${err}`)
    } else {
      const { items } = await result
      res.json({
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        }, 
        body: result
      });
    }
  });

});

app.post('/informe', (req, res) => {
  var params = {
    TableName: 'ssff-informe',
    Limit: 20,
  };

  docClient.scan(params, async (err, result) => {
    if (err) {
      console.log(`[ERR] ${err}`)
    } else {
      const { items } = await result
      res.json({
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },     
        body: result
      });
    }
  });
});

module.exports.generic = http(app);