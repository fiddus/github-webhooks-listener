/* global describe, it */

'use strict';


var verifyGitHubSignature = require('../lib/verifyGitHubSignature'),
    expect = require('chai').expect;

describe('Testing verifyGitHubSignature Module', function () {

    it('should return true if signature is correct', function (done) {
        var secret = 'secret',
            signature = 'sha1=a887d228b2462e1a9998f3c3a82aa1fb9f45e1f8',
            req = {
                header: function () {
                    return signature;
                },
                body: {
                    empty: 'body'
                }
            };

        verifyGitHubSignature.setSecret(secret);

        expect(verifyGitHubSignature.ofRequest(req)).to.equal(true);
        done();
    });

    it('should return false if signature is incorrect', function (done) {
        var secret = 'secret',
            signature = 'some dumb signature',
            req = {
                header: function () {
                    return signature;
                },
                body: {
                    empty: 'body'
                }
            };

        verifyGitHubSignature.setSecret(secret);

        expect(verifyGitHubSignature.ofRequest(req)).to.equal(false);
        done();
    });
});
