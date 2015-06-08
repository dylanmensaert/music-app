define(function(require) {
    'use strict';

    var Ember = require('ember');

    return Ember.Component.extend({
        layoutName: 'actionBar',
        classNames: ['action-bar', 'container', 'text-center'],
        snippets: null,
        isEverySaved: function() {
            return this.get('snippets').isEvery('isSaved', true);
        }.property('snippets.@each.isSaved'),
        isEveryUnsaved: function() {
            return this.get('snippets').isEvery('isSaved', false);
        }.property('snippets.@each.isSaved'),
        savedSnippets: function() {
            return this.get('snippets').filterBy('isSaved', true);
        }.property('snippets.@each.isSaved'),
        unsavedSnippets: function() {
            return this.get('snippets').filterBy('isSaved', false);
        }.property('snippets.@each.isSaved'),
        actions: {
            save: function() {
                this.get('unsavedSnippets').forEach(function(snippet) {
                    snippet.fetchDownload().then(function() {
                        snippet.save();
                    });
                });
            },
            remove: function() {
                this.get('savedSnippets').forEach(function(snippet) {
                    snippet.remove();
                });
            },
            deselect: function() {
                this.get('snippets').setEach('isSelected', false);
            }
        }
    });
});
