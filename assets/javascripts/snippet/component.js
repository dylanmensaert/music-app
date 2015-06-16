define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        layoutName: 'snippet',
        classNames: ['row', 'row-fill'],
        classNameBindings: ['model.isSelected:active'],
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
