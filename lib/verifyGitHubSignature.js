'use strict';

var crypto = require('crypto'),
    compare = require('secure-compare'),
    verifyGitHubSignature = {};

(function () {
    var secret;

    verifyGitHubSignature.setSecret = function (s) {
        secret = s;
    };

    verifyGitHubSignature.ofRequest = function (req) {
        if (!secret) {
            throw new Error('Secret was not set');
        }

        var hmac = crypto.createHmac('sha1', secret);

        hmac.update(JSON.stringify(req.body));

        return compare(req.header('X-Hub-Signature'), 'sha1=' + hmac.digest('hex'));
    };
})();

module.exports = verifyGitHubSignature;
