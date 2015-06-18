define(function(require) {
    'use strict';

    var Ember = require('ember'),
        injectAudio = require('audio/inject'),
        injectFileSystem = require('file-system/inject'),
        injectSession = require('session/inject');

    Ember.onLoad('Ember.Application', function(Application) {
        injectAudio(Application);
        injectFileSystem(Application);
        injectSession(Application);
    });
});
