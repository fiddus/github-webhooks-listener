'use strict'

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    bodyParser = require('body-parser'),
    async = require('async'),
    shell = require('shelljs'),
    appPath = '/home/git/case4you-server',
    appStartCmd = 'forever start app.js',
    appStopCmd = 'forever stop app.js';

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/deploy', function (req, res) {

    // If master was updated, do stuff
    if (req.body.ref && req.body.ref === 'refs/heads/master') {
        shell.cd(appPath);

        async.series([
            function stopCurrentRunning (next) {
                console.log('stopping current running app')
                shell.exec(appStopCmd, next);
            },
            function gitPull (next) {
                console.log('Fetching changes');
                shell.exec('git pull origin master', next);
            },
            function npmInstall (next) {
                console.log('Installing new dependencies, if any');
                shell.exec('npm install', next);
            },
            function runNewVersion () {
                console.log('starting updated app');
                shell.exec(appStartCmd, function () {
                    res.statusCode(200).send();
                });
            }
        ]);
    } else {
        res.statusCode(200).send();
    }
});

server.listen(5000, function() {
    console.log('Listening for Deploy Events');
});
