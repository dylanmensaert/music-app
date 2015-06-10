define(function(require) {
    'use strict';

    var secret = require('meta/secret');

    return {
        downloadHost: 'http://www.youtube-mp3.org',
        suggestHost: 'http://suggestqueries.google.com',
        searchHost: 'https://www.googleapis.com',
        imageHost: 'https://i.ytimg.com',
        key: secret.key
    };
});
