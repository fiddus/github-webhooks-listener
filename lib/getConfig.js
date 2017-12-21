var inquirer = require('inquirer'),
    fs = require('fs'),
    CONFIG_FILE = './config.json',

    prompts = [{
        type: 'input',
        name: 'branch',
        message: 'Branch of the app repo you want to keep updated.',
        default: 'master'
    }, {
        type: 'input',
        name: 'route',
        message: 'Set the route in the server that will be listenig for POST requests. This must be the same path passed to GitHub Webhooks. A POST handler will be attached to this route.',
        default: '/payload'
    }, {
        type: 'input',
        name: 'port',
        message: 'Port in which node will be listening to POST requests.',
        default: '5000'
    }, {
        type: 'input',
        name: 'appPath',
        message: 'Root path of the app you want to keep updated. This will be the pwd for the commands that will be executed.'
    }, {
        type: 'input',
        name: 'stopCmd',
        message: 'Shell command to be issued in order to stop the current running app.',
        default: 'forever stop app.js'
    }, {
        type: 'input',
        name: 'updateCmd',
        message: 'Shell command to be issued to fetch the new version of the app. `{branch}` will be replaced by branch name.',
        default: 'git pull origin {branch}'
    }, {
        type: 'input',
        name: 'postUpdateCmd',
        message: 'Shell command to be issued after fetching new version. Could be something like npm install or grunt deploy, or whatever',
        default: 'npm install'
    }, {
        type: 'input',
        name: 'startCmd',
        message: 'Shell command to restart the app, after updated.',
        default: 'forever start app.js'
    }],

    getConfig = function (cb) {
        var config;

        fs.readFile(CONFIG_FILE, function (err, data) {
            if (!err) {
                config = JSON.parse(data);
                cb(config);
            }
            else {
                inquirer.prompt(prompts, function (answers) {
                    config = answers;
                    fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 4), function (err) {

                        if (err) {
                            throw err;
                        }

                        cb(config);
                    });

                });
            }
        });
    };

module.exports = getConfig;
