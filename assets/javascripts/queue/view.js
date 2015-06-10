define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.View.extend({
        classNames: ['list-group'],
        // TODO: Remove styling
        attributeBindings: ['style', 'id'],
        id: 'queue',
        style: function() {
            return 'background: red; height: 100px;';
        }.property(''),
        didInsertElement: function() {
            this.$().sortable({
                revert: 200,
                axis: 'y'
            });
        },
        willDestroyElement: function() {
            this.$().sortable('destroy');
        }
    });
});
