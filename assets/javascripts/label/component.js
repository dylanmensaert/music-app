define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        layoutName: 'label',
        classNames: ['label'],
        classNameBindings: ['label.isSelected:label-success:label-default'],
        label: null,
        click: function() {
            this.toggleProperty('label.isSelected');

            this.sendAction('action');
        }
    });
});
