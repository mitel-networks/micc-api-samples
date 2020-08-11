'use strict';

const express = require('express');
const bodyParser = require('body-parser')
const fulfillment = require('./fulfillment');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

app.post('/mitelSampleAgentFulfillment', fulfillment.mitelSampleAgentFulfillment);
  
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
