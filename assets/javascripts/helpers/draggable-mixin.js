define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Mixin.create({
        didInsertElement: function() {
            this.$().draggable({
                start: this.onDragStart.bind(this),
                axis: 'y',
                // TODO: keep initial component
                helper: 'clone',
                appendTo: 'parent',
                revert: 'invalid',
                scrollSensitivity: 100,
                connectToSortable: '#' + this.get('parentView.elementId'),
                containment: 'parent',
                handle: '.handle',
                delay: 100
            });
        },
        willDestroyElement: function() {
            this.$().draggable('destroy');
        }
    });
});
