define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend(require('helpers/droppable-mixin'), {
        layoutName: 'label',
        classNames: ['label'],
        classNameBindings: ['label.isSelected:label-success:label-default'],
        label: null,
        onDrop: function(event, ui) {
            // TODO: Implement following
            /*ui.helper.data('snippets');*/
        },
        click: function() {
            this.toggleProperty('label.isSelected');
        }
    });
});
