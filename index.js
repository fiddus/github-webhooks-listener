'use strict'

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    bodyParser = require('body-parser'),
    async = require('async'),
    shell = require('shelljs'),
    appPath = '/home/git/case4you-server',
    appStartCmd = 'forever start app.js',
    appStopCmd = 'forever stop app.js',
    secret = process.env.DEPLOY_LISTENER_SECRET,
    crypto = require('crypto'),
    compare = require('secure-compare'),

    isRequestAuthentic = function (req) {
        var hmac = crypto.createHmac('sha1', secret);

        hmac.update(JSON.stringify(req.body));

        return compare(req.header('X-Hub-Signature'), 'sha1=' + hmac.digest('hex'));
    };

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/deploy', function (req, res) {

    // Checking if request is authentic
    if (isRequestAuthentic(req)) {

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
                        res.status(200).send();
                    });
                }
            ]);
        } else {
            res.status(200).send();
        }
    } else {
        res.status(403).send();
    }

});



server.listen(5000, function() {
    console.log('Listening for Deploy Events');
});
