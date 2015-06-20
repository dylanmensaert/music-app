define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        layoutName: 'label',
        classNames: ['btn', 'grid-label'],
        classNameBindings: ['model.isSelected:btn-primary'],
        model: null,
        showEdit: false,
        didClick: null,
        actions: {
            click: function() {
                this.didClick();
            },
            remove: function() {
                // TODO: Implement
            }
        }
    });
});
