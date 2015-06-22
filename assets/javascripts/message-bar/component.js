define(function(require) {
    'use strict';

    var Ember = require('ember'),
        fadeOut;

    fadeOut = function() {
        this.$().fadeOut(500, function() {
            this.set('content', null);
        }.bind(this));
    };

    return Ember.Component.extend({
        layoutName: 'messageBar',
        classNames: ['message-bar'],
        content: null,
        update: function() {
            if (!Ember.isEmpty(this.get('content'))) {
                Ember.run.debounce(this, fadeOut, 2000);
            }
        }.observes('content').on('didInsertElement'),
    });
});
