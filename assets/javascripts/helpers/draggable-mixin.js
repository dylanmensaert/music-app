define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Mixin.create({
        isDraggable: true,
        attributeBindings: ['isDraggable:draggable'],
        dragStart: function(event) {
            this.set('isDragging', true);

            var dragData = {
                elementId: this.get('elementId')
            };

            event.dataTransfer.setData('application/json', JSON.stringify(this.get(dragdata)));
        },
        dragEnd: function() {
            this.set('isDragging', false);
        },
        wasDroppedOn: function(droppedOnView) {
            return droppedOnView;
        }
    });
});
