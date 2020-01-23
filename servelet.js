const express = require('express');
const path = require('path');
const logger = require('morgan');
const port = 2097;

var app = express();

app.use(express.static(__dirname));
app.use(logger('dev'));

module.exports = app;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'match.html'));
})

app.get('/prematch', (req, res) => {
  res.sendFile(path.join(__dirname, 'prematch.html'));
})

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'settings.html'));
})

app.listen(port, () => {
  console.log(`Deploying app on port ${port}!`)
})