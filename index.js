'use strict'

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    bodyParser = require('body-parser'),
    async = require('async'),
    shell = require('shelljs'),
    appPath = '/home/git/case4you-server',
    appStartCmd = 'forever start app.js',
    appStopCmd = 'forever stopall';

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/deploy', function (req, res) {

    // If master was updated, do stuff
    if (req.body.ref && req.body.ref === 'refs/heads/master') {
        shell.cd(appPath);

        async.series([
            function stopCurrentRunning (next) {
                shell.exec(appStartCmd, next);
            },
            function npmInstall (next) {
                shell.exec('npm install', next);
            },
            function gitPull (next) {
                shell.exec('git pull origin master', next);
            },
            function runNewVersion () {
                shell.exec(appStartCmd);
            }
        ]);
    }

    res.send(200);
});

server.listen(5000, function() {
    console.log('Listening for Deploy Events');
});
