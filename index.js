'use strict'

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/deploy', function (req, res) {
    console.log('req.body', req.body);
    res.send();
});

server.listen(5000, function() {
    console.log('Listening for Deploy Events');
});
