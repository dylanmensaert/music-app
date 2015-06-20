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
            var selectedSnippets = this.get('session.selectedSnippets'),
                labels = [],
                name,
                isEvery;

            this.get('fileSystem.labels').forEach(function(label) {
                name = label.get('name');

                if (utilities.isMatch(name, this.get('query'))) {
                    if (selectedSnippets.get('length')) {
                        isEvery = selectedSnippets.every(function(snippet) {
                            return snippet.get('labels').contains(name);
                        });

                        label.set('isSelected', isEvery);
                    }

                    labels.pushObject(label);
                }
            }.bind(this));

            return labels;
        }.property('fileSystem.labels.@each.name', 'session.selectedSnippets.@each', 'query'),
        didClick: function() {
            var selectedSnippets = this.get('session.selectedSnippets'),
                labels,
                label;

            return function() {
                label = this.get('model');

                label.toggleProperty('isSelected');

                if (selectedSnippets.get('length')) {
                    selectedSnippets.forEach(function(snippet) {
                        labels = snippet.get('labels');

                        if (label.get('isSelected')) {
                            labels.pushObject(label.get('name'));
                        } else {
                            labels.removeObject(label.get('name'));
                        }
                    });
                } else {
                    // TODO: implement
                }
            };
        }.property('session.selectedSnippets.@each'),
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
            removeLabel: function(label) {
                this.get('fileSystem.snippets').forEach(function(snippet) {
                    snippet.get('labels').removeObject(label.get('name'));
                });

                this.get('fileSystem.labels').removeObject(label);
            }
        }
    });
});
