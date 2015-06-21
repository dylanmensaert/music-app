define(function(require) {
    'use strict';

    var Ember = require('ember');

    // TODO: Implement as focus-input
    // TODO: send action on suggestion click
    return Ember.TextField.extend({
        classNames: ['form-control'],
        attributeBindings: ['placeholder'],
        insertNewline: function() {
            this.sendAction('insert-newline');

            this.$().typeahead('close');
        },
        fetchSuggestions: null,
        didInsertElement: function() {
            this.$().typeahead({
                highlight: true,
                hint: false
            }, {
                source: this.get('fetchSuggestions')
            });
        },
        willDestroyElement: function() {
            this.$().typeahead('destroy');
        }
    });
});
