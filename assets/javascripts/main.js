/* global DS: true */
(function() {
    'use strict';

    require.config({
        enforceDefine: true,
        baseUrl: 'javascripts',
        paths: {
            ember: '../bower_components/ember/ember.debug',
            'ember-data': '../bower_components/ember-data/ember-data',
            handlebars: '../bower_components/handlebars/handlebars.runtime',
            jquery: '../bower_components/jquery/dist/jquery',
            core: '../bower_components/jquery-ui/ui/core',
            mouse: '../bower_components/jquery-ui/ui/mouse',
            widget: '../bower_components/jquery-ui/ui/widget',
            draggable: '../bower_components/jquery-ui/ui/draggable',
            droppable: '../bower_components/jquery-ui/ui/droppable',
            sortable: '../bower_components/jquery-ui/ui/sortable',
            'jquery.mobile.vmouse': '../bower_components/jquery-mobile/js/jquery.mobile.vmouse',
            'jquery.mobile.ns': '../bower_components/jquery-mobile/js/jquery.mobile.ns',
            'jquery.mobile.support.touch': '../bower_components/jquery-mobile/js/jquery.mobile.support.touch',
            touch: '../bower_components/jquery-mobile/js/events/touch',
            bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
            nouislider: '../bower_components/nouislider/distribute/jquery.nouislider',
            'bootstrap-material-design': '../bower_components/bootstrap-material-design/dist/js/material',
            ripples: '../bower_components/bootstrap-material-design/dist/js/ripples',
            moment: '../bower_components/momentjs/moment',
            typeahead: '../bower_components/typeahead.js/dist/typeahead.jquery',
            'meta-data': 'meta/data'
        },
        map: {
            '*': {
                jquery: 'jquery-private'
            },
            'jquery-private': {
                jquery: 'jquery'
            }
        },
        shim: {
            ember: {
                deps: ['jquery', 'handlebars'],
                exports: 'Ember'
            },
            'ember-data': {
                deps: ['ember'],
                exports: 'DS'
            },
            handlebars: {
                exports: 'Handlebars'
            },
            bootstrap: {
                deps: ['jquery'],
                exports: 'jQuery'
            },
            nouislider: {
                deps: ['jquery'],
                exports: 'jQuery'
            },
            ripples: {
                deps: ['jquery'],
                exports: 'jQuery'
            },
            'bootstrap-material-design': {
                deps: ['ripples'],
                exports: 'jQuery'
            },
            typeahead: {
                deps: ['jquery'],
                exports: 'jQuery'
            },
            draggable: {
                deps: ['core', 'mouse', 'widget'],
                exports: 'jQuery'
            },
            droppable: {
                deps: ['draggable'],
                exports: 'jQuery'
            },
            sortable: {
                deps: ['core', 'mouse', 'widget'],
                exports: 'jQuery'
            },
            'jquery.mobile.support.touch': {
                deps: ['jquery.mobile.ns'],
                exports: 'jQuery'
            },
            // TODO: Had to change touch.js file to make dependency work. "../jquery.mobile.vmouse" -> "./jquery.mobile.vmouse". Look into correct way of implementing this
            touch: {
                deps: ['jquery.mobile.support.touch', 'jquery.mobile.vmouse'],
                exports: 'jQuery'
            }
        },
        deps: ['init/init']
    });
})();
