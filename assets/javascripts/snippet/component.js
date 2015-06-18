define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        layoutName: 'snippet',
        classNames: ['row', 'row-fill'],
        attributeBindings: ['name'],
        name: function() {
            return this.get('model.id');
        }.property('model.id'),
        model: null,
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
