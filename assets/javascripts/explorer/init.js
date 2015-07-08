define(function(require) {
    'use strict';

    var App = require('init/app');

    App.ExplorerRoute = require('explorer/route');
    App.ExplorerController = require('explorer/controller');

    App.ExplorerIndexRoute = require('explorer/index/route');
    App.ExplorerIndexController = require('explorer/index/controller');
});
