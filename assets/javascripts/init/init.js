define(function(require) {
    'use strict';

    require('init/templates');
    require('init/presentation');
    require('init/router');

    require('application/init');
    require('index/init');
    require('labels/init');
    require('queue/init');

    require('draggable');
    require('droppable');
    require('sortable');

    var App = require('init/app');

    App.advanceReadiness();
});
