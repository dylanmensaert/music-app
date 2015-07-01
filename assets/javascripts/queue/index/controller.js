define(function(require) {
    'use strict';

    var Ember = require('ember'),
        utilities = require('helpers/utilities');

    /*TODO: lot of duplication with index controller. Maybe implement via mixin*/
    return Ember.Controller.extend(require('helpers/actions-mixin'), require('snippet/actions-mixin'), {
        fetchSuggestions: function() {
            return function(query, callback) {
                var suggestions = [],
                    key;

                // TODO: check if label contains a snippet which is queued?
                this.get('fileSystem.labels').forEach(function(label) {
                    key = label.get('name');

                    if (!label.get('isHidden') && utilities.isMatch(key, query)) {
                        suggestions.pushObject({
                            value: key
                        });
                    }
                });

                this.get('fileSystem.snippets').forEach(function(snippet) {
                    key = snippet.get('name');

                    if (snippet.get('isQueued') && utilities.isMatch(key, query)) {
                        suggestions.pushObject({
                            value: key
                        });
                    }
                });

                callback(suggestions);
            }.bind(this);
        }.property('fileSystem.snippets.@each.name', 'fileSystem.queue.@each'),
        sortedSnippets: function() {
            return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
                content: this.get('snippets'),
                sortProperties: ['name', 'id'],
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
            var snippets = [],
                query = this.get('query'),
                matchAnyLabel;

            return this.get('fileSystem.snippets').filter(function(snippet) {
                matchAnyLabel = snippet.get('labels').any(function(label) {
                    return utilities.isMatch(label, query);
                });

                return snippet.get('isQueued') && (matchAnyLabel || utilities.isMatch(snippet.get('name'), query));
            });
        }.property('query', 'fileSystem.snippets.@each.name', 'fileSystem.queue.@each'),
        // TODO: Implement - avoid triggering on init?
        /*updateMessage: function() {
            if (!this.get('snippets.length')) {
                this.set('cache.message', 'No songs found');
            }
        }.observes('snippets.length'),*/
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

            this.set('cache.selectedSnippets', selectedSnippets);
        }.observes('snippets.@each.isSelected'),
        originals: Ember.computed.alias('fileSystem.snippets'),
        selected: Ember.computed.alias('cache.selectedSnippets'),
        actions: {
            removeFromQueue: function(snippet) {
                if (snippet.get('isPlaying')) {
                    this.send('next');
                }

                this.get('fileSystem.queue').removeObject(snippet.get('id'));

                this.set('cache.message', 'Removed from queue');
            },
            repeat: function() {
                this.set('fileSystem.queueState', 'repeat');
            },
            shuffle: function() {
                this.set('fileSystem.queueState', 'shuffle');
            }
        }
    });
});
