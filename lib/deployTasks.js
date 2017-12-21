'use strict';

var async = require('async'),
    deployTasks = {};

(function () {
    var branch,
        appPath,
        stopCmd,
        updateCmd,
        postUpdateCmd,
        startCmd,
        shell,
        initConfigCalled = false;

    deployTasks.initConfig = function (conf) {
        branch = conf.branch;
        appPath = conf.appPath;
        stopCmd = conf.stopCmd;
        updateCmd = conf.updateCmd.replace('{branch}', branch);
        postUpdateCmd = conf.postUpdateCmd;
        startCmd = conf.startCmd;
        shell = conf.shell || require('shelljs');
        initConfigCalled = true;
    };

    deployTasks.commandFactory = function (command) {
        return function (next) {
            if (command !== undefined && command !== '') {
                shell.exec(command, next);
            } else {
                next();
            }
        }
    }

    deployTasks.run = function (cb) {
        if (!initConfigCalled) {
            throw new Error('You should call initConfig first');
        }

        shell.cd(appPath);

        async.series([
            deployTasks.commandFactory(stopCmd),
            deployTasks.commandFactory(updateCmd),
            deployTasks.commandFactory(postUpdateCmd),
            deployTasks.commandFactory(startCmd),
            cb
        ]);
    };
})();

module.exports = deployTasks;
