'use strict';


var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    bodyParser = require('body-parser'),
    secret = process.env.DEPLOY_LISTENER_SECRET,
    verifyGitHubSignature = require('./lib/verifyGitHubSignature'),
    getConfig = require('./lib/getConfig'),
    deployTasks = require('./lib/deployTasks');

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

verifyGitHubSignature.setSecret(secret);

getConfig(function (config) {
    deployTasks.initConfig(config);

    app.post(config.route, function (req, res) {

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

    server.listen(config.port, function () {
        console.log('Listening for Deploy Events');
    });
});
