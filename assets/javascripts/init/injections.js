define(function(require) {
    'use strict';

    var Ember = require('ember'),
        injectAudio = require('audio/inject'),
        injectFileSystem = require('file-system/inject'),
        injectCache = require('cache/inject');

    Ember.onLoad('Ember.Application', function(Application) {
        injectAudio(Application);
        injectFileSystem(Application);
        injectCache(Application);
    });
});
