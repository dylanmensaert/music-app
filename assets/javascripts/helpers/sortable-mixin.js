define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Mixin.create({
        didInsertElement: function() {
            this.$().sortable({
                update: this.didUpdate.bind(this),
                revert: 200,
                axis: 'y',
                items: '.list-group-item',
                delay: 100,
                helper: 'clone',
                containment: this.$(),
                handle: '.media-right'
            });
        },
        willDestroyElement: function() {
            this.$().sortable('destroy');
        }
    });
});
