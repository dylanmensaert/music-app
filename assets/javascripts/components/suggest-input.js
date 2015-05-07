define(function(require) {
    'use strict';

    var Ember = require('ember'),
        meta = require('meta-data'),
        fetchSuggestions;

    fetchSuggestions = function(query, callback) {
        var url = meta.suggestHost + '/complete/search?client=firefox&ds=yt',
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

    // TODO: Implement as focus-input
    return Ember.TextField.extend({
        classNames: ['form-control'],
        attributeBindings: ['placeholder'],
        placeholder: 'Search',
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
