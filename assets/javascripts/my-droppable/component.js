define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend(require('my-droppable/mixin'), {
        layoutName: 'myDroppable',
        classNames: ['droppable-bar'],
        onDrop: function(event, ui) {
            // TODO: Implement following
            /*ui.helper.data('snippets');*/
        }
    });
});
