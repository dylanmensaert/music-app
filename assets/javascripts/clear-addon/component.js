define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        layoutName: 'clear_addon',
        classNames: ['input-group-btn'],
        text: '',
        didInsertElement: function() {
            Ember.$.material.ripples(this.$());
        },
        actions: {
            clear: function() {
                this.set('text', '');
            }
        }
    });
});
