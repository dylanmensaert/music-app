define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Mixin.create({
        /*isDragging: false,
        willDragStart: function() {
            this.set('isDragging', true);
        },*/
        didInsertElement: function() {
            this.$().draggable({
                start: function(event, ui) {
                    this.willDragStart(event, ui);
                }.bind(this),
                stop: function() {
                    // TODO: keep initial component
                    /*this.set('isDragging', false);*/
                }.bind(this),
                axis: 'y',
                // TODO: keep initial component
                helper: 'clone',
                appendTo: 'parent',
                revert: 'invalid',
                scrollSensitivity: 100,
                connectToSortable: '#' + this.get('parentView.elementId'),
                containment: 'parent',
                handle: '.handle'
            });
        },
        willDestroyElement: function() {
            this.$().draggable('destroy');
        }
    });
});
