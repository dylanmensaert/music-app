define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Mixin.create({
        isDragOver: false,
        dragEnter: function() {
            this.set('isDragOver', true);
        },
        dragLeave: function() {
            this.set('isDragOver', false);
        },
        dragOver: function(event) {
            event.preventDefault();
        },
        drop: function(event) {
            var dragData,
                draggedView;

            event.preventDefault();

            dragData = JSON.parse(event.dataTransfer.getData('application/json'));
            draggedView = Ember.View.views[dragData.elementId];

            this.handleDrop(dragData);

            //TODO: If drop takes too long, dragEnd never gets called.
            draggedView.dragEnd();
            this.set('isDragOver', false);

            event.stopPropagation();
        }
    });
});
