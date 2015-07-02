define(function(require) {
    'use strict';

    var Ember = require('ember');

    // TODO: send action on suggestion click
    return Ember.TextField.extend({
        classNames: ['form-control', 'floating-label'],
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

            Ember.$.material.input(this.$());
        },
        willDestroyElement: function() {
            this.$().typeahead('destroy');
        }
    });
});
