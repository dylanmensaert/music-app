/* global window: true */
define(function(require) {
    'use strict';

    require('init/injections');

    var Ember = require('ember'),
        App;

    App = Ember.Application.create({
        ready: function() {
            Ember.$('.loading-bar').remove();
        },
        LOG_TRANSITIONS: true
    });

    App.deferReadiness();

    return App;
});
