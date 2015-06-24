define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        layoutName: 'label',
        classNames: ['btn', 'grid-label', 'btn-raised'],
        classNameBindings: ['model.isSelected:btn-primary:btn-default'],
        model: null,
        didInsertElement: function() {
            Ember.$.material.ripples(this.$());
        },
        actions: {
            click: function() {
                this.toggleProperty('model.isSelected');

                this.sendAction('action', this.get('model'));
            }
        }
    });
});
