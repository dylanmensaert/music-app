define(function(require) {
    'use strict';

    var Ember = require('ember'),
        Label = require('label/object'),
        utilities = require('helpers/utilities');

    return Ember.Controller.extend(require('helpers/actions-mixin'), {
        fetchSuggestions: function() {
            return function(query, callback) {
                var suggestions = [],
                    name;

                this.get('fileSystem.labels').forEach(function(label) {
                    name = label.get('name');

                    if (this.showLabel(label) && utilities.isMatch(name, query)) {
                        suggestions.pushObject({
                            value: name
                        });
                    }
                }.bind(this));

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

                if (this.showLabel(label) && utilities.isMatch(
                        name, this.get('query'))) {
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
        originals: Ember.computed.alias('fileSystem.labels'),
        selected: function() {
            return this.get('labels').filterBy('isSelected');
        }.property('labels.@each.isSelected'),
        hasSingle: function() {
            return this.get('selected.length') === 1;
        }.property('selected.length'),
        showLabel: function(label) {
            return !label.get('isHidden') && (!label.get('isReadOnly') || this.get('cache.selectedSnippets.length'));
        },
        actions: {
            create: function() {
                var liveQuery = this.get('liveQuery'),
                    labels = this.get('fileSystem.labels');

                if (!Ember.isEmpty(liveQuery)) {
                    if (!labels.isAny('name', liveQuery)) {
                        labels.pushObject(Label.create({
                            name: liveQuery
                        }));
                    } else {
                        this.get('cache').showMessage('Label <strong>' + liveQuery + '</strong> already exists');
                    }
                }

                this.set('liveQuery', '');
            },
            toggle: function(label) {
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

                        this.get('cache').showMessage('Added to label <strong>' + label.get('name') + '</strong>');
                    } else {
                        labels.removeObject(label.get('name'));

                        this.get('cache').showMessage('Removed from label <strong>' + label.get('name') + '</strong>');
                    }
                }.bind(this));

                if (this.get('isEditMode')) {
                    this.send('exitEdit');
                }
            }
        }
    });
});
