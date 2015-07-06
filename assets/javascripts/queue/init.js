define(function(require) {
    'use strict';

    var App = require('init/app');

    App.QueueRoute = require('queue/route');
    App.QueueController = require('queue/controller');

    App.QueueIndexRoute = require('queue/index/route');
    App.QueueIndexController = require('queue/index/controller');
});
