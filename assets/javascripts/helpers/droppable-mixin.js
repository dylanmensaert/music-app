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
        didInsertElement: function() {
            this.$().droppable({
                drop: function(event, ui) {

                }
            });
        }
    });
});
