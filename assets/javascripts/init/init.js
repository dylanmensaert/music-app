define(function(require) {
    'use strict';

    require('init/templates');
    require('init/presentation');
    require('init/router');

    require('application/init');
    require('index/init');
    require('session/init');

    var App = require('init/app');

    App.advanceReadiness();
});
