define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Mixin.create({
        onDrop: null,
        didInsertElement: function() {
            this.$().droppable({
                drop: function(event, ui) {
                    this.onDrop(event, ui);
                }.bind(this)
            });
        }
    });
});
