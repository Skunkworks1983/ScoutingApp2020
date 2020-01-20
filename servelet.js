const express = require('express');
const path = require('path');
const logger = require('morgan');
const port = 2097;

var app = express();

app.use(express.static(path.join(__dirname, '..')));
app.use(logger('dev'));

module.exports = app;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'match.html'));
})

app.listen(port, () => {
  console.log(`Deploying app on port ${port}!`)
})