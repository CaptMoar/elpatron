'use strict';

const http = require('serverless-http');
const express = require('express');
// const aws = require('aws-sdk');
// const cors = require('cors')
const bodyParser = require('body-parser');
// const { response } = require('express');

const auditoriaController = require('./src/controller/auditoriaController');

const app = express();
// const docClient = new aws.DynamoDB();
// const docClientUpd = new aws.DynamoDB.DocumentClient();
// const s3 = new aws.S3();
// const tableName = process.env.tableName

// app.use(cors())

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', auditoriaController)

module.exports.generic = http(app);