define(function(require) {
    'use strict';

    var Ember = require('ember'),
        Label = require('label/object'),
        utilities = require('helpers/utilities');

    return Ember.Controller.extend({
        liveQuery: '',
        query: '',
        fetchSuggestions: function() {
            return function(query, callback) {
                var suggestions = [],
                    name;

                this.get('fileSystem.labels').forEach(function(label) {
                    name = label.get('name');

                    if (utilities.isMatch(name, query)) {
                        suggestions.pushObject({
                            value: name
                        });
                    }
                });

                callback(suggestions);
            }.bind(this);
        }.property('fileSystem.labels.@each'),
        sortedLabels: function() {
            return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
                content: this.get('labels'),
                sortProperties: ['name']
            });
        }.property('labels'),
        labels: function() {
            var selectedSnippets = this.get('cache.selectedSnippets'),
                labels = [],
                name,
                isSelected;

            this.get('fileSystem.labels').forEach(function(label) {
                name = label.get('name');

                if (utilities.isMatch(name, this.get('query'))) {
                    if (selectedSnippets.get('length')) {
                        isSelected = selectedSnippets.every(function(snippet) {
                            return snippet.get('labels').contains(name);
                        });
                    } else {
                        isSelected = false;
                    }

                    label.set('isSelected', isSelected);

                    labels.pushObject(label);
                }
            }.bind(this));

            return labels;
        }.property('fileSystem.labels.@each.name', 'cache.selectedSnippets.@each', 'query'),
        hasSingle: function() {
            return this.get('selectedLabels.length') === 1;
        }.property('selectedLabels.length'),
        linkToProperties: {
            tagName: 'div',
            classNames: ['inner-label']
        },
        actions: {
            search: function() {
                this.set('query', this.get('liveQuery'));
            },
            createLabel: function() {
                var liveQuery = this.get('liveQuery'),
                    labels = this.get('fileSystem.labels');

                if (!Ember.isEmpty(liveQuery)) {
                    if (!labels.isAny('name', liveQuery)) {
                        labels.pushObject(Label.create({
                            name: liveQuery
                        }));
                    } else {
                        // TODO: Error when label already exists
                    }
                }

                this.set('query', '');
            },
            remove: function() {
                var labels = this.get('fileSystem.labels');

                this.get('selectedLabels').forEach(function(label) {
                    labels.removeObject(label);
                });
            },
            toggleLabel: function(label) {
                var selectedSnippets = this.get('cache.selectedSnippets'),
                    snippets = this.get('fileSystem.snippets'),
                    labels;

                selectedSnippets.forEach(function(snippet) {
                    labels = snippet.get('labels');

                    if (label.get('isSelected')) {
                        labels.pushObject(label.get('name'));

                        if (!snippets.isAny('id', snippet.get('id'))) {
                            snippets.pushObject(snippet);
                        }

                        this.set('cache.message', 'Added to label <strong>' + label.get('name') + '</strong>');
                    } else {
                        labels.removeObject(label.get('name'));

                        this.set('cache.message', 'Removed from label <strong>' + label.get('name') + '</strong>');
                    }
                }.bind(this));
            }
        }
    });
});
