define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Mixin.create({
        isDragging: false,
        willDragStart: function() {
            this.set('isDragging', true);
        },
        didInsertElement: function() {
            this.$().draggable({
                start: function(event, ui) {
                    this.willDragStart(event, ui);
                }.bind(this),
                stop: function() {
                    this.set('isDragging', false);
                }.bind(this),
                drag: function() {
                    var test = this.get('element');

                    this.$().draggable('option', 'helper', function() {
                        return test;
                    });
                }.bind(this),
                helper: 'clone',
                axis: 'y',
                appendTo: 'body',
                revert: 'invalid',
                scrollSensitivity: 100
            });
        }
    });
});
