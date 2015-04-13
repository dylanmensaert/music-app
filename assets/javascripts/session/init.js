define(function(require) {
    'use strict';

    var App = require('init/app'),
        LSSerializer = require('ember-localstorage-adapter').LSSerializer,
        LSAdapter = require('ember-localstorage-adapter').LSAdapter;

    App.Session = require('session/model');

    App.SessionSerializer = LSSerializer.extend();
    App.SessionAdapter = LSAdapter.extend();
});
