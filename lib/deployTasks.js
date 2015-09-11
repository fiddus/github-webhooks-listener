'use strict';

var async = require('async'),
    deployTasks = {};

(function () {
    var appPath,
        stopCmd,
        updateCmd,
        postUpdateCmd,
        startCmd,
        shell,
        initConfigCalled = false;

    deployTasks.initConfig = function (conf) {
        appPath = conf.appPath || '';
        stopCmd = conf.stopCmd ||  '';
        updateCmd = conf.updateCmd ||  '';
        postUpdateCmd = conf.postUpdateCmd || '';
        startCmd = conf.startCmd || '';
        shell = conf.shell || require('shelljs');
        initConfigCalled = true;
    };

    deployTasks.run = function (cb) {
        if (!initConfigCalled) {
            throw new Error('You should call initConfig first');
        }

        shell.cd(appPath);

        async.series([
            function stopCurrentRunning (next) {
                shell.exec(stopCmd, next);
            },
            function gitPull (next) {
                shell.exec(updateCmd, next);
            },
            function npmInstall (next) {
                shell.exec(postUpdateCmd, next);
            },
            function runNewVersion () {
                shell.exec(startCmd, cb);
            }
        ]);
    };
})();

module.exports = deployTasks;
