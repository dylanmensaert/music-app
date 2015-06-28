define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        layoutName: 'menuIcon',
        classNames: ['inner-label'],
        icon: null,
        didInsertElement: function() {
            Ember.$.material.ripples(this.$());
        },
        click: function() {
            this.sendAction('action');
        }
    });
});
