define(function(require) {
    'use strict';

    var App = require('init/app'),
        Ember = require('ember'),
        moment = require('moment');

    require('bootstrap');
    require('bootstrap-slider');

    Ember.TextSupport.reopen({
        classNames: ['form-control']
    });

    Ember.Select.reopen({
        classNames: ['form-control']
    });

    App.FocusInputComponent = Ember.TextField.extend({
        becomeFocused: function() {
            this.$().focus();
        }.on('didInsertElement')
    });

    Ember.Handlebars.registerBoundHelper('time', function(seconds) {
        return moment.utc(seconds * 1000).format('mm:ss');
    });
});
