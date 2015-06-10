define(function(require) {
    'use strict';

    var secret = require('meta/secret'),
        host = 'http://localhost:9000';

    return {
        downloadHost: host,
        suggestHost: host,
        searchHost: host,
        imageHost: host,
        key: secret.key
    };
});
