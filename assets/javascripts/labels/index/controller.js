define(function(require) {
    'use strict';

    var Ember = require('ember'),
        Label = require('label/object');

    return Ember.Controller.extend({
        query: null,
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

            if (selectedSnippets.get('length')) {
                labels.forEach(function(label) {
                    isEvery = selectedSnippets.every(function(snippet) {
                        return snippet.get('labels').contains(label.get('name'));
                    });

                    label.set('isSelected', isEvery);
                });
            }

            return labels;
        }.property('fileSystem.labels.@each', 'selectedSnippets.@each'),
        actions: {
            createLabel: function() {
                var query = this.get('query'),
                    labels = this.get('fileSystem.labels');

                if (!Ember.isEmpty(query)) {
                    if (!labels.isAny('name', query)) {
                        labels.pushObject(Label.create({
                            name: query
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
            }
        }
    });
});
