define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Mixin.create({
        attributeBindings: ['isDraggable:draggable'],
        isDraggable: true,
        isDragging: false,
        dragStart: function() {
            this.set('isDragging', true);
        },
        dragEnd: function() {
            this.set('isDragging', false);
        }
    });
});
