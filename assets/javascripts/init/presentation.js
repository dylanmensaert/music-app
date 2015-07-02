define(function(require) {
    'use strict';

    var Ember = require('ember'),
        moment = require('moment');

    require('bootstrap');
    require('nouislider');
    require('typeahead');
    require('bootstrap-material-design');
    require('jqueryui-touch-punch');

    require('components/init');

    Ember.TextSupport.reopen({
        classNames: ['form-control']
    });

    Ember.Select.reopen({
        classNames: ['form-control']
    });

    require('touch');

    Ember.$.event.special.swipe.horizontalDistanceThreshold = 100;

    Ember.LinkView.reopen({
        //TODO: init only needed because classNameBindings are execute in controller context instead of this
        init: function() {
            this.setProperties(this.get('properties'));

            this._super();
        },
        properties: null,
        didInsertElement: function() {
            Ember.$.material.ripples(this.$());
        }
    });

    Ember.Handlebars.registerBoundHelper('time', function(seconds) {
        return moment.utc(seconds * 1000).format('mm:ss');
    });
});
