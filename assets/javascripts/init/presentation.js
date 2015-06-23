define(function(require) {
    'use strict';

    var Ember = require('ember'),
        moment = require('moment');

    require('bootstrap');
    require('nouislider');
    require('typeahead');
    require('bootstrap-material-design');

    require('components/init');

    Ember.TextSupport.reopen({
        classNames: ['form-control']
    });

    Ember.Select.reopen({
        classNames: ['form-control']
    });

    Ember.LinkView.reopen({
        classNames: ['btn'],
        classNameBindings: ['active:btn-primary:btn-default'],
        didInsertElement: function() {
            Ember.$.material.ripples(this.$());
        }
    });

    Ember.Handlebars.registerBoundHelper('time', function(seconds) {
        return moment.utc(seconds * 1000).format('mm:ss');
    });
});
