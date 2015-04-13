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
            'ember-localstorage-adapter': '../bower_components/ember-localstorage-adapter/localstorage_adapter',
            jquery: '../bower_components/jquery/dist/jquery',
            bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
            'bootstrap-slider': '../bower_components/seiyria-bootstrap-slider/js/bootstrap-slider',
            moment: '../bower_components/momentjs/moment',
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
            'ember-localstorage-adapter': {
                deps: ['ember-data'],
                exports: 'DS.LSAdapter',
                init: function() {
                    return {
                        LSAdapter: DS.LSAdapter,
                        LSSerializer: DS.LSSerializer
                    };
                }
            },
            handlebars: {
                exports: 'Handlebars'
            },
            bootstrap: {
                deps: ['jquery'],
                exports: 'jQuery'
            },
            'bootstrap-slider': {
                deps: ['jquery'],
                exports: 'jQuery'
            }
        },
        deps: ['init/init']
    });
})();
