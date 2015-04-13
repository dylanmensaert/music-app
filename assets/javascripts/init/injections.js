define(function(require) {
    'use strict';

    var Ember = require('ember'),
        injectSession = require('session/inject'),
        injectAudio = require('audio/inject');

    Ember.onLoad('Ember.Application', function(Application) {
        injectSession(Application);
        injectAudio(Application);
    });
});
