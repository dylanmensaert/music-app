define(function(require) {
    'use strict';

    var Ember = require('ember'),
        metaData = require('meta-data'),
        focusInputComponent = require('components/focus-input'),
        fetchSuggestions;

    fetchSuggestions = function(query, callback) {
        var url = metaData.suggestHost + '/complete/search?client=firefox',
            suggestions;

        url += '&q=' + query;

        Ember.$.getJSON(url).then(function(response) {
            suggestions = response[1].map(function(suggestion) {
                return {
                    value: suggestion
                };
            });

            callback(suggestions);
        });
    };

    return focusInputComponent.extend({
        classNames: ['form-control'],
        attributeBindings: ['placeholder'],
        placeholder: 'Search',
        insertNewline: function() {
            this.sendAction('insert-newline');
        },
        didInsertElement: function() {
            this.$().typeahead({
                highlight: true,
                hint: false
            }, {
                source: fetchSuggestions
            });
        },
        willDestroyElement: function() {
            this.$().typeahead('destroy');
        }
    });
});
