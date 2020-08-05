'use strict';

const http = require('serverless-http');
const express = require('express');
const aws = require('aws-sdk');
const cors = require('cors')
const bodyParser = require('body-parser');
const { response } = require('express');

const app = express();
const docClient = new aws.DynamoDB();
const tableName = process.env.tableName

app.use(cors())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send(`yi boi`)
});

app.post('/resumen', (req, res) => {
  var params = {
    TableName: 'ssff-informe-resumen', 
    FilterExpression: 'contains(fecha, :fecha)',
    ExpressionAttributeValues: {
      ":fecha": {"S": new Date(Date.now()).toISOString().split('T')[0]}
      //":fecha": {"S": "2020-08"}
    }       
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

app.post('/resumen/getByRut', (req, res) => {
  var params = {
    TableName: "ssff-informe-resumen",
    FilterExpression: 'contains(rut, :rut)',
    ExpressionAttributeValues: {
      //":rut": {"S": "12019183-7"}
      ":rut": {"S": JSON.parse(req.body.toString('utf8')).rut} 
    }  
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

app.post('/resumen/getByFecha', (req, res) => {
  var params = {
    TableName: "ssff-informe-resumen",
    FilterExpression: 'fecha = :fecha',
    ExpressionAttributeValues: {
      //":fecha": {"S": "2020-07-23"}     
      ":fecha": {"S": JSON.parse(req.body.toString('utf8')).fecha} 
    }  
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

app.post('/resumen/getByEstado', (req, res) => {
  var params = {
    TableName: "ssff-informe-resumen",
    FilterExpression: 'estado = :estado',
    ExpressionAttributeValues: {
      //":estado": {"S": "EN PROCESO"}     
      ":estado": {"S": JSON.parse(req.body.toString('utf8')).estado} 
    }  
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

app.post('/auditoria/getById', (req, res) => {
  var params = {
    KeyConditionExpression: 'id_audio = :id_audio',
    ExpressionAttributeValues: {      
      ':id_audio': {'S': JSON.parse(req.body.toString('utf8')).id_audio}
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