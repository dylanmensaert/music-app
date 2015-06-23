define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        layoutName: 'label',
        classNames: ['btn', 'grid-label', 'btn-raised'],
        classNameBindings: ['model.isSelected:btn-primary:btn-default'],
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
