define(function(require) {
    'use strict';

    var Ember = require('ember'),
        moment = require('moment');

    require('bootstrap');
    require('bootstrap-slider');
    require('typeahead');

    require('components/init');

    Ember.TextSupport.reopen({
        classNames: ['form-control']
    });

    Ember.Select.reopen({
        classNames: ['form-control']
    });

    Ember.Handlebars.registerBoundHelper('time', function(seconds) {
        return moment.utc(seconds * 1000).format('mm:ss');
    });
});
