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

                    if (utilities.includes(name, query)) {
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
        selectedSnippets: function() {
            return this.get('fileSystem.snippets').filterBy('isSelected');
        }.property('fileSystem.snippets.@each.isSelected'),
        labels: function() {
            var selectedSnippets = this.get('selectedSnippets'),
                labels = this.get('fileSystem.labels'),
                isEvery;

            labels = labels.filter(function(label) {
                return utilities.includes(label.get('name'), this.get('query'));
            }.bind(this));

            if (selectedSnippets.get('length')) {
                labels.forEach(function(label) {
                    isEvery = selectedSnippets.every(function(snippet) {
                        return snippet.get('labels').contains(label.get('name'));
                    });

                    label.set('isSelected', isEvery);
                });
            }

            return labels;
        }.property('fileSystem.labels.@each.name', 'selectedSnippets.@each', 'query'),
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
            clickLabel: function(label) {
                var selectedSnippets = this.get('selectedSnippets'),
                    labels;

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
