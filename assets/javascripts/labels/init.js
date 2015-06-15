define(function(require) {
    'use strict';

    var App = require('init/app');

    App.LabelsRoute = require('labels/route');
    App.LabelsController = require('labels/controller');

    App.LabelsIndexRoute = require('labels/index/route');
    App.LabelsIndexController = require('labels/index/controller');
});
