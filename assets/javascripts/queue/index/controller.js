define(function(require) {
    'use strict';

    var Ember = require('ember'),
        utilities = require('helpers/utilities');

    /*TODO: lot of duplication with index controller. Maybe implement via mixin*/
    return Ember.Controller.extend({
        query: '',
        liveQuery: '',
        fetchSuggestions: function() {
            return function(query, callback) {
                var title,
                    suggestions = [];

                this.get('fileSystem.snippets').forEach(function(snippet) {
                    title = snippet.get('title');

                    if (snippet.get('isQueued') && (utilities.includes(title, query) || snippet.containsLabel(query))) {
                        suggestions.pushObject({
                            value: title
                        });
                    }
                }.bind(this));

                callback(suggestions);
            }.bind(this);
        }.property('fileSystem.snippets.@each.title', 'fileSystem.queue.@each'),
        sortedSnippets: function() {
            return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
                content: this.get('snippets'),
                sortProperties: ['title', 'id'],
                orderBy: function(snippet, other) {
                    var queue = this.get('fileSystem.queue'),
                        result = -1;

                    if (queue.indexOf(snippet.get('id')) > queue.indexOf(other.get('id'))) {
                        result = 1;
                    }

                    return result;
                }.bind(this)
            });
        }.property('snippets.@each', 'fileSystem.queue.@each'),
        snippets: function() {
            var query = this.get('query'),
                isQueued,
                includesQuery,
                containsLabel;

            return this.get('fileSystem.snippets').filter(function(snippet) {
                return snippet.get('isQueued') && (utilities.includes(snippet.get('title'), query) || snippet.containsLabel(query));
            }.bind(this));
        }.property('query', 'fileSystem.snippets.@each.title', 'fileSystem.queue.@each'),
        didUpdate: function(snippetIds) {
            var firstSnippetId = snippetIds.get('firstObject'),
                hasChangedFirst = this.get('fileSystem.queue.firstObject') !== firstSnippetId,
                firstSnippet;

            this.set('fileSystem.queue', snippetIds);

            this.get('snippets').forEach(function(snippet) {
                if (hasChangedFirst && snippet.get('id') === firstSnippetId) {
                    firstSnippet = snippet;
                }
            });

            if (!Ember.isEmpty(firstSnippet)) {
                this.get('audio').play(firstSnippet);
            }
        },
        /*TODO: Implement another way?*/
        updateSelectedSnippets: function() {
            var selectedSnippets = this.get('snippets').filterBy('isSelected');

            this.set('session.selectedSnippets', selectedSnippets);
        }.observes('snippets.@each.isSelected'),
        actions: {
            search: function() {
                this.set('query', this.get('liveQuery'));
            }
        }
    });
});
