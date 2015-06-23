define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        layoutName: 'snippet',
        classNames: ['list-group-item', 'snippet-item'],
        attributeBindings: ['name'],
        name: function() {
            return this.get('model.id');
        }.property('model.id'),
        model: null,
        didInsertElement: function() {
            this.$().on('swipeleft', function() {
                this.sendAction('swipeleft', this.get('model'));
            }.bind(this));

            this.$().on('swiperight', function() {
                this.sendAction('swiperight', this.get('model'));
            }.bind(this));

            Ember.$.material.ripples(this.$());
        },
        didDestroyElement: function() {
            this.$().off('swipeleft');
            this.$().off('swiperight');
        },
        actions: {
            toggleSelection: function() {
                this.get('model').toggleProperty('isSelected');
            },
            click: function() {
                this.sendAction('action', this.get('model'));
            }
        }
    });
});
