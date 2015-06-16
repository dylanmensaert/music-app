define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        layoutName: 'label',
        classNames: ['btn', 'grid-label'],
        classNameBindings: ['model.isSelected::btn-primary'],
        model: null,
        click: function() {
            this.toggleProperty('model.isSelected');

            this.sendAction('action');
        }
    });
});
