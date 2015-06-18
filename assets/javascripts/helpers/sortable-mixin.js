define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Mixin.create({
        didInsertElement: function() {
            this.$().sortable({
                update: this.didUpdate.bind(this),
                revert: 200,
                axis: 'y',
                items: '.row',
                delay: 100,
                helper: 'clone',
                containment: this.$(),
                handle: '.handle'
            });
        },
        willDestroyElement: function() {
            this.$().sortable('destroy');
        }
    });
});
