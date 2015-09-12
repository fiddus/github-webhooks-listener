/* global describe, it, beforeEach */

'use strict';


var deployTasks = require('../lib/deployTasks'),
    expect = require('chai').expect,
    sinon = require('sinon'),
    stubShell,
    config = {
        appPath: '/path/to/app',
        stopCmd: 'stop app',
        updateCmd: 'fetch app',
        postUpdateCmd: 'update app',
        startCmd: 'start app'
    };

describe('Testing deployTasks module', function () {

    beforeEach(function (done) {
        stubShell = {
            cd: sinon.spy(),
            exec: sinon.stub().callsArg(1)
        };
        config.shell = stubShell;
        deployTasks.initConfig(config);
        done();
    });

    it('should change directory to app Path', function (done) {
        deployTasks.run(function () {
            expect(stubShell.cd.calledOnce).to.equal(true);
            expect(stubShell.cd.calledWith(config.appPath)).to.equal(true);
            done();
        });
    });

    it('should run tasks in correct order: stop, update, postUpdate and start', function (done) {
        deployTasks.run(function () {
            expect(stubShell.exec.getCall(0).args[0]).to.equal(config.stopCmd);
            expect(stubShell.exec.getCall(1).args[0]).to.equal(config.updateCmd);
            expect(stubShell.exec.getCall(2).args[0]).to.equal(config.postUpdateCmd);
            expect(stubShell.exec.getCall(3).args[0]).to.equal(config.startCmd);
            done();
        });
    });
});
