define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        layoutName: 'ripple',
        click: function() {
            this.sendAction('action');
        },
        didInsertElement: function() {
            Ember.$.material.ripples(this.$());
        }
    });
});
