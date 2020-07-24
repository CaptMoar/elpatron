'use strict';

const http = require('serverless-http');
const express = require('express');
const aws = require('aws-sdk');
const bodyParser = require('body-parser');
const { response } = require('express');

const app = express();
const docClient = new aws.DynamoDB.DocumentClient();
const tableName = process.env.tableName

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send(`yi boi`)
});

app.post('/informe', (req, res) => {
  var params = {
    TableName: 'ssff-informe',
    Limit: 20,
  };

  docClient.scan(params, async (err, result) => {
    console.log(result)
    if (err) {
      console.log(`[ERR] ${err}`)
    } else {
      const { items } = await result;
      console.log(JSON.stringify(result))
      res.json({
        success: true,
        message: `aca va el informe`,
        informe: result
      });
    }
  });
});

// app.post('/informe/pag', (req, res) => {
//   const { pageSize, lastItem } = req.body;
//   try {
//     const params = {
//       TableName: 'ssff-informe',
//       Limit: pageSize,
//     };
//     if (lastItem) {
//       params.ExclusiveStartKey = { item_id: lastItem };
//     }
//     const response = await dynamoDb.scan(params).promise();
//     return {
//       items: response.Items,
//       lastItem: response.LastEvaluatedKey
//     }
//   } catch (error) {
//     res.json({pageSize, lastItem});
//   }
// });

module.exports.generic = http(app);