define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        layoutName: 'label',
        classNames: ['btn', 'grid-label', 'btn-raised'],
        classNameBindings: ['model.isSelected:btn-material-grey-300:btn-default'],
        model: null,
        didInsertElement: function() {
            Ember.$.material.ripples(this.$());
        },
        click: function() {
            this.toggleProperty('model.isSelected');

            this.sendAction('action', this.get('model'));
        }
    });
});
