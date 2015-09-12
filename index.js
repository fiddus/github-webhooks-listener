'use strict';

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    bodyParser = require('body-parser'),
    appPath = '/home/git/case4you-server',
    appStartCmd = 'forever start app.js',
    appStopCmd = 'forever stop app.js',
    appUpdateCmd = 'git pull origin master',
    postUpdateCmd = 'npm install',
    secret = process.env.DEPLOY_LISTENER_SECRET,
    verifyGitHubSignature = require('./lib/verifyGitHubSignature'),
    deployTasks = require('./lib/deployTasks');

deployTasks.initConfig({
    appPath: appPath,
    stopCmd: appStopCmd,
    updateCmd: appUpdateCmd,
    postUpdateCmd: postUpdateCmd,
    startCmd: appStartCmd
});

verifyGitHubSignature.setSecret(secret);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/deploy', function (req, res) {

    // Checking if request is authentic
    if (verifyGitHubSignature.ofRequest(req)) {

        // If master was updated, do stuff
        if (req.body.ref && req.body.ref === 'refs/heads/master') {

            deployTasks.run(function () {
                res.status(200).send();
            });

        } else {
            // if other branches were updated, send 200 only to make github happy...
            res.status(200).send();
        }
    } else {
        res.status(403).send();
    }
});

server.listen(5000, function () {
    console.log('Listening for Deploy Events');
});
